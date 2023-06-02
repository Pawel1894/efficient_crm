import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { Delete, Edit, KeyboardArrowLeft, Visibility } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { OrganizationMembershipResource } from "@clerk/types";
import Head from "next/head";
import { useSystemStore } from "../_app";
import Controls from "./Controls";
import PendingInvites from "@/components/PendingInvites";
import { OrganizationMembershipRole } from "@clerk/nextjs/server";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

type Member = {
  role: string;
  publicUserData: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    profileImageUrl: string;
    identifier: string;
    userId: string;
  };
};

export default function Page() {
  const { membership, organization } = useOrganization({
    membershipList: {},
  });

  const { data: membershipList, refetch, isRefetching } = api.system.getMembershipList.useQuery(undefined);

  const { user } = useUser();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const remove = async (member: OrganizationMembershipResource) => {
    if (member.publicUserData.userId === user?.publicMetadata.userId) return;
    if (member.publicUserData.userId) {
      try {
        await organization?.removeMember(member.publicUserData.userId);
        await refetch();
      } catch (error) {
        const err = error as {
          errors: Array<{ message: string }>;
        };
        toast.error(err?.errors[0]?.message);
      }
    }
  };

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Team Details</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  async function updateRole(userId: string, role: OrganizationMembershipRole) {
    try {
      await organization?.updateMember({
        role,
        userId,
      });
      await refetch();
    } catch (error) {
      const err = error as {
        errors: Array<{ message: string }>;
      };
      toast.error(err?.errors[0]?.message);
    }
  }

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "action",
        headerName: "",
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params) => {
          const data = params.row as OrganizationMembershipResource;

          if (!data.publicUserData.userId) return "";

          return (
            <Stack direction={"row"} gap={"0.5rem"}>
              <Link href={`/user/${data.publicUserData.userId}`}>
                <IconButton size="small" sx={{ color: "primary.main" }} title="View">
                  <Visibility />
                </IconButton>
              </Link>
              {membership?.role === "admin" ? (
                <IconButton
                  onClick={() => {
                    void remove(data);
                  }}
                  size="small"
                  color="warning"
                  title="Delete"
                >
                  <Delete />
                </IconButton>
              ) : null}
            </Stack>
          );
        },
      },
      {
        field: "imageUrl",
        headerName: "",
        renderCell: (params) => {
          const data = params.row as Member;
          return (
            <Image
              style={{ borderRadius: "100%" }}
              width={35}
              height={35}
              src={data.publicUserData.profileImageUrl}
              alt="member profile image"
            />
          );
        },
        width: 60,
      },
      {
        field: "identifier",
        headerName: "Identifier",
        valueGetter: (params) => {
          const data = params.row as Member;
          return data.publicUserData.identifier;
        },
        flex: 1,
        minWidth: 170,
      },
      {
        field: "role",
        headerName: "Role",
        renderCell: (params) => {
          const data = params.row as Member;

          return membership?.role === "admin" ? (
            <Select
              sx={{
                height: "2rem",
              }}
              value={data.role}
              onChange={(e) =>
                void updateRole(data.publicUserData.userId, e.target.value as OrganizationMembershipRole)
              }
            >
              <MenuItem key={"role_admin"} value={"admin"}>
                Admin
              </MenuItem>
              <MenuItem key={"role_basic_member"} value={"basic_member"}>
                Basic Member
              </MenuItem>
            </Select>
          ) : (
            data.role
          );
        },
        flex: 1,
      },
      {
        field: "First name",
        valueGetter: (params) => {
          const data = params.row as Member;
          return data.publicUserData.firstName;
        },
        headerName: "First name",
        flex: 1,
      },
      {
        field: "Last name",
        valueGetter: (params) => {
          const data = params.row as Member;
          return data.publicUserData.lastName;
        },
        headerName: "Last name",
        flex: 1,
      },
    ],
    [membership?.role]
  );

  return (
    <>
      <Head>
        <title>Team {organization?.name}</title>
      </Head>
      {membership?.role === "admin" && <Controls />}
      <>
        <Typography variant="h5">Members</Typography>
        <Box mt={3} mb={5} minHeight={400} height={"50vh"} width={"100%"}>
          {isRefetching || !membershipList ? (
            <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
          ) : (
            <DataGrid rowSelection={false} rows={membershipList} columns={columns} />
          )}
        </Box>
      </>
      <Divider />
      <>
        <PendingInvites />
      </>
    </>
  );
}