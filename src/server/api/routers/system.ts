import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";

export const systemRouter = createTRPCRouter({
  coldStart: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        userName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id not found",
        });
      }

      const active1 = await ctx.prisma.dictionary.create({
        data: {
          type: "ACTIVITY_STATUS",
          label: "open",
          value: "open",
          orgId: input.id,
        },
      });

      const active2 = await ctx.prisma.dictionary.create({
        data: {
          type: "ACTIVITY_STATUS",
          label: "active",
          value: "active",
          orgId: input.id,
        },
      });

      const active3 = await ctx.prisma.dictionary.create({
        data: {
          type: "ACTIVITY_STATUS",
          label: "closed",
          value: "closed",
          orgId: input.id,
        },
      });

      const deal1 = await ctx.prisma.dictionary.create({
        data: {
          type: "DEAL_STAGE",
          label: "open",
          value: "open",
          orgId: input.id,
        },
      });

      const deal2 = await ctx.prisma.dictionary.create({
        data: {
          type: "DEAL_STAGE",
          label: "active",
          value: "active",
          orgId: input.id,
        },
      });

      const deal3 = await ctx.prisma.dictionary.create({
        data: {
          type: "DEAL_STAGE",
          label: "closed",
          value: "closed",
          orgId: input.id,
        },
      });

      const lead1 = await ctx.prisma.dictionary.create({
        data: {
          type: "LEAD_STATUS",
          label: "open",
          value: "open",
          orgId: input.id,
        },
      });

      const lead2 = await ctx.prisma.dictionary.create({
        data: {
          type: "LEAD_STATUS",
          label: "active",
          value: "active",
          orgId: input.id,
        },
      });

      const lead3 = await ctx.prisma.dictionary.create({
        data: {
          type: "LEAD_STATUS",
          label: "closed",
          value: "closed",
          orgId: input.id,
        },
      });

      // create lead
      const leadObject = await ctx.prisma.lead.create({
        data: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          createdBy: input.userName,
          updatedBy: input.userName,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          teamName: input.name,
          team: input.id,
          comment: "simple comment",
          company: "example company",
          dictionaryId: lead1.id,
        },
      });

      const leadObject1 = await ctx.prisma.lead.create({
        data: {
          firstName: "Merry",
          lastName: "Doe",
          email: "merry@email.com",
          createdBy: input.userName,
          updatedBy: input.userName,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          teamName: input.name,
          team: input.id,
          comment: "",
          company: "Acme company",
          dictionaryId: lead2.id,
        },
      });

      const leadObject2 = await ctx.prisma.lead.create({
        data: {
          firstName: "Harper",
          lastName: "Smith",
          email: "harper@smith.com",
          createdBy: input.userName,
          updatedBy: input.userName,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          teamName: input.name,
          team: input.id,
          comment: "simple comment",
          company: "example company",
          dictionaryId: lead3.id,
        },
      });

      const leadObject4 = await ctx.prisma.lead.create({
        data: {
          firstName: "Bob",
          lastName: "Smith",
          email: "bob@example.com",
          createdBy: input.userName,
          updatedBy: input.userName,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          teamName: input.name,
          team: input.id,
          comment: "simple comment",
          company: "example company",
          dictionaryId: lead1.id,
        },
      });

      // create deals
      await ctx.prisma.deal.create({
        data: {
          comment: "Test comment",
          value: 0,
          createdBy: ctx.user.id,
          forecast: 20000,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          updatedBy: ctx.user.id,
          team: input.id,
          teamName: input.name,
          stage: {
            connect: {
              id: deal1.id,
            },
          },
          lead: {
            connect: {
              id: leadObject.id,
            },
          },
        },
      });

      await ctx.prisma.deal.create({
        data: {
          comment: "Very iteresting comment",
          value: 17000,
          createdBy: ctx.user.id,
          forecast: 12000,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          updatedBy: ctx.user.id,
          team: input.id,
          teamName: input.name,
          stage: {
            connect: {
              id: deal2.id,
            },
          },
          lead: {
            connect: {
              id: leadObject1.id,
            },
          },
        },
      });

      await ctx.prisma.deal.create({
        data: {
          comment: "Very iteresting comment",
          value: 11000,
          createdBy: ctx.user.id,
          forecast: 14000,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          updatedBy: ctx.user.id,
          team: input.id,
          teamName: input.name,
          updatedAt: dayjs().set("M", 2).toISOString(),
          stage: {
            connect: {
              id: deal1.id,
            },
          },
          lead: {
            connect: {
              id: leadObject2.id,
            },
          },
        },
      });

      await ctx.prisma.deal.create({
        data: {
          comment: "Very iteresting comment",
          value: 8000,
          createdBy: ctx.user.id,
          forecast: 4000,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          updatedBy: ctx.user.id,
          team: input.id,
          teamName: input.name,
          updatedAt: dayjs().set("M", 1).toISOString(),
          stage: {
            connect: {
              id: deal2.id,
            },
          },
          lead: {
            connect: {
              id: leadObject2.id,
            },
          },
        },
      });

      await ctx.prisma.activity.create({
        data: {
          date: dayjs().toDate(),
          owner: ctx.user.id,
          ownerFullname: input.userName,
          createdBy: input.userName,
          updatedBy: input.userName,
          team: input.id,
          teamName: input.name,
          status: {
            connect: {
              id: active2.id,
            },
          },
          lead: {
            connect: {
              id: leadObject.id,
            },
          },
          title: "Send offert",
          description: "Send offert via email",
        },
      });

      await ctx.prisma.activity.create({
        data: {
          date: new Date(),
          owner: ctx.user.id,
          ownerFullname: input.userName,
          team: input.id,
          teamName: input.name,
          createdBy: input.userName,
          updatedBy: input.userName,
          status: {
            connect: {
              id: active1.id,
            },
          },
          lead: {
            connect: {
              id: leadObject2.id,
            },
          },
          title: "Meeting",
          description: "F2F meeting at lead's office",
          location: "Wrocław office - somewhere",
        },
      });

      await ctx.prisma.activity.create({
        data: {
          date: new Date(),
          owner: ctx.user.id,
          ownerFullname: input.userName,
          team: input.id,
          teamName: input.name,
          createdBy: input.userName,
          updatedBy: input.userName,
          status: {
            connect: {
              id: active1.id,
            },
          },
          lead: {
            connect: {
              id: leadObject1.id,
            },
          },
          title: "Meeting",
          description: "Call meeting to discuss our new offert",
          location: "via Teams",
        },
      });

      const settings = await ctx.prisma.userControl.findFirst({
        where: {
          userId: ctx.user.id,
        },
      });

      return settings;
    }),
  getMembershipList: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.id || !ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User id not found",
      });
    }

    return await clerkClient.organizations.getOrganizationMembershipList({ organizationId: ctx.user.orgId });
  }),
});
