import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUser } from "@/utils/helper";
import { ActivitySchema } from "@/utils/schema";
import { type OrganizationMembership } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";
import dayjs from "dayjs";
import { z } from "zod";

export const activityRouter = createTRPCRouter({
  today: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot fetch activities",
      });
    }

    const where: { owner?: string | null; team: string; AND: { date: { gt: string; lt: string } } } = {
      team: ctx.user.orgId,
      AND: {
        date: {
          gt: dayjs().startOf("day").toISOString(),
          lt: dayjs().startOf("day").add(2, "day").toISOString(),
        },
      },
    };

    if (ctx.user.role !== "admin") {
      where.owner = ctx.user.id;
    }

    const activities = await ctx.prisma.activity.findMany({
      where: {
        team: ctx.user.orgId,
        AND: {
          date: {
            gt: dayjs().startOf("day").toISOString(),
            lt: dayjs().startOf("day").add(1, "day").toISOString(),
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      include: {
        lead: true,
        status: true,
      },
      take: 5,
    });

    return activities;
  }),
  activities: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId || !ctx.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot fetch activities",
      });
    }

    const where: {
      team: string;
      AND?: {
        owner: string;
      };
    } = {
      team: ctx.user.orgId,
    };

    if (ctx.user.role !== "admin") {
      where.AND = {
        owner: ctx.user.id,
      };
    }

    const results = await ctx.prisma.activity.findMany({
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        status: true,
        lead: true,
      },
    });

    return results;
  }),
  create: protectedProcedure.input(ActivitySchema).mutation(async ({ ctx, input }) => {
    let userDetails: OrganizationMembership | undefined;

    if (ctx.user.orgId && ctx.user.id) {
      userDetails = await getUser(ctx.user.orgId, ctx.user.id);
    }

    if (!userDetails || !ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Saving activity failed, please refresh and try again.",
      });
    }

    const { owner: _, status: __, lead: ___, ...params } = input;

    const activity = await ctx.prisma.activity.create({
      data: {
        ...params,
        owner: input.owner?.userId,
        ownerFullname: input.owner?.identifier,
        dictionaryId: input.status,
        updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
        createdBy: userDetails.publicUserData?.identifier ?? "undefined",
        team: ctx.user.orgId,
        teamName: userDetails.organization.name,
        leadId: input.lead,
      },
    });

    return activity;
  }),
  update: protectedProcedure
    .input(
      yup.object({
        id: yup.string(),
        data: ActivitySchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      let userDetails: OrganizationMembership | undefined;

      if (ctx.user.orgId && ctx.user.id) {
        userDetails = await getUser(ctx.user.orgId, ctx.user.id);
      }

      if (!userDetails || !ctx.user.orgId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Saving activity failed, please refresh and try again.",
        });
      }

      const { owner: _, status: __, lead: ___, ...params } = input.data;

      const activity = await ctx.prisma.activity.update({
        where: {
          id: input.id,
        },
        data: {
          ...params,
          owner: input.data.owner?.userId,
          ownerFullname: input.data.owner?.identifier,
          dictionaryId: input.data.status,
          updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
          team: ctx.user.orgId,
          teamName: userDetails.organization.name,
          leadId: input.data.lead,
        },
      });

      return activity;
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.activity.delete({
      where: {
        id: input,
      },
    });
  }),
});
