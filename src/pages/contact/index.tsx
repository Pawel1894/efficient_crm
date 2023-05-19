import { organizations } from "@clerk/nextjs/api";
import Layout from "@/components/Layout";
import { Box, Breadcrumbs, Button, IconButton, Modal, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { api } from "@/utils/api";
import type { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { Add, Edit, Visibility } from "@mui/icons-material";
import Insert from "./Insert";
import { NextApiRequest, NextApiResponse } from "next";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import superjson from "superjson";
import { prisma } from "@/server/db";

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    filterable: false,
    hideable: false,
    sortable: false,
    renderCell: (params) => {
      return (
        <Stack direction={"row"} gap={"0.5rem"}>
          <Link href={`/contact/${params.id}`}>
            <IconButton size="small" sx={{ color: "primary.main" }} title="View">
              <Visibility />
            </IconButton>
          </Link>
          <IconButton size="small" sx={{ color: "primary.main" }} title="Edit">
            <Edit />
          </IconButton>
        </Stack>
      );
    },
  },
  { field: "firstName", headerName: "First Name", flex: 1, minWidth: 170 },
  { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 170 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 170 },
  { field: "type", headerName: "Type", flex: 1 },
  { field: "ownerFullname", headerName: "Owner", flex: 1 },
];

export default function Page() {
  const [insertOpen, setInsertOpen] = useState(false);
  const { data: contacts, isSuccess } = api.contact.contacts.useQuery();

  return (
    <>
      <Insert insertOpen={insertOpen} setInsertOpen={setInsertOpen} />
      <Stack gap={"1rem"}>
        <Box>
          <Button variant="outlined" onClick={() => setInsertOpen(true)}>
            create contact <Add />
          </Button>
        </Box>
        {isSuccess ? (
          <Box
            sx={{
              height: "calc(100vh - 200px)",
            }}
          >
            <DataGrid rowSelection={false} rows={contacts} columns={columns} />
          </Box>
        ) : (
          <div></div>
        )}
      </Stack>
    </>
  );
}
