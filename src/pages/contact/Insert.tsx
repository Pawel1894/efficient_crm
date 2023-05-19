import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as yup from "yup";
import React, { useState, type SetStateAction } from "react";
import { useFormik } from "formik";
import { Close } from "@mui/icons-material";
import { useOrganization } from "@clerk/nextjs";
import { api } from "@/utils/api";
import Link from "next/link";
import { ContactSchema } from "@/utils/schema";
import { toast } from "react-toastify";

type Props = {
  setInsertOpen: React.Dispatch<SetStateAction<boolean>>;
  insertOpen: boolean;
};

export default function Insert({ insertOpen, setInsertOpen }: Props) {
  const desktopBr = useMediaQuery("(min-width:600px)");

  const { data: types } = api.dictionary.byType.useQuery("CONTACT_TYPE");
  const { membershipList } = useOrganization({
    membershipList: {},
  });
  const { mutate: submit } = api.contact.create.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      company: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      comment: "",
      owner: {
        identifier: "",
        userId: "",
      },
      type: "",
    },
    validationSchema: ContactSchema,
    onSubmit: (values) => {
      submit(values);
    },
  });

  return (
    <Modal sx={{ backgroundColor: "#202020" }} open={insertOpen}>
      <>
        <Stack
          borderBottom={"1px solid"}
          borderColor={"primary.main"}
          direction={"row"}
          p={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h6" component={"span"}>
            Create new contact
          </Typography>
          <IconButton size="large" onClick={() => setInsertOpen(false)}>
            <Close />
          </IconButton>
        </Stack>
        <Stack
          sx={{
            height: "calc(100vh - 70px)",
          }}
          mt={desktopBr ? 4 : 2}
          mb={4}
          mx={"auto"}
          p={1}
          overflow={"auto"}
          maxWidth={"1400px"}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid justifyContent={"center"} container rowGap={2}>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <TextField
                    fullWidth
                    required
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <TextField
                    fullWidth
                    required
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <TextField
                    fullWidth
                    required
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <TextField
                    fullWidth
                    id="company"
                    name="company"
                    label="Company"
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    error={formik.touched.company && Boolean(formik.errors.company)}
                    helperText={formik.touched.company && formik.errors.company}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <TextField
                    fullWidth
                    id="location"
                    name="location"
                    label="Location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={formik.touched.location && Boolean(formik.errors.location)}
                    helperText={formik.touched.location && formik.errors.location}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    getOptionLabel={(option) => option.publicUserData.identifier}
                    renderInput={(params) => <TextField {...params} id="owner" name="owner" label="Owner" />}
                    options={membershipList ?? []}
                    onChange={(e, value) =>
                      void formik.setFieldValue("owner", {
                        identifier: value?.publicUserData.identifier,
                        userId: value?.publicUserData.userId,
                      })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    renderInput={(params) => <TextField {...params} id="type" name="type" label="Type" />}
                    options={types ?? []}
                    onChange={(e, value) => void formik.setFieldValue("type", value?.id)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box px={1}>
                  <TextField
                    fullWidth
                    minRows={3}
                    multiline
                    id="comment"
                    name="comment"
                    label="Comment"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    error={formik.touched.comment && Boolean(formik.errors.comment)}
                    helperText={formik.touched.comment && formik.errors.comment}
                  />
                </Box>
              </Grid>
            </Grid>

            <Box px={1} my={3} display={"flex"}>
              <Button
                sx={{
                  marginLeft: "auto",
                  width: desktopBr ? "max-content" : "100%",
                }}
                color="primary"
                variant="contained"
                type="submit"
              >
                Create
              </Button>
            </Box>
          </form>
        </Stack>
      </>
    </Modal>
  );
}
