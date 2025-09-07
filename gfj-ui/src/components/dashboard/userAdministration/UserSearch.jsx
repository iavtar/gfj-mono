import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

const initialFormData = {
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
};

const UserSearch = ({setSearchPayload, setSearchOpen}) => {
  const { user } = useSelector((state) => state.user.userDetails || {});

  const createSearchPayload = async (values) => {
    const requestPayload = {
      username: values?.username,
      firstName: values?.firstName,
      lastName: values?.lastName,
      email: values?.email,
      phoneNumber: values?.phoneNumber,
      isActive: true
    };

    setSearchPayload(requestPayload)
  };

  const formik = useFormik({
    initialValues: { ...initialFormData },
    enableReinitialize: true,
    onSubmit: (values) => {
      createSearchPayload(values);
    },
  });

  const handleClearSearch = () => {
    formik.resetForm();
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-4">
        <Typography
          variant="h5"
          className="text-[#4c257e] font-bold flex items-center"
        >
          Search
        </Typography>
        <Box className="flex items-center gap-2">
          <Button
            size="small"
            onClick={() => handleClearSearch()}
            sx={{ fontWeight: 500, borderRadius: 50, color: "gray" }}
          >
            <RefreshIcon />
          </Button>
          <Button
            size="small"
            onClick={() => handleCloseSearch()}
            sx={{ fontWeight: 500, borderRadius: 50, color: "gray" }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            width: "100%",
          }}
        >
          {/* Username */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </div>

          {/* Email */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </div>

          {/* First Name */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
          </div>

          {/* Last Name */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
          </div>

          {/* Phone */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <PhoneInput
              country={"us"}
              inputProps={{
                name: "phoneNumber",
                required: true,
              }}
              inputStyle={{
                width: "100%",
                height: "56px",
              }}
              specialLabel="Phone Number"
              value={formik.values.phoneNumber}
              onChange={(value, country) => {
                const formattedValue = `+${country.dialCode}-${value.replace(
                  country.dialCode,
                  ""
                )}`;
                formik.setFieldValue("phoneNumber", formattedValue);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="text-[#d32f2f] text-[12px] mt-1">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>
        </div>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            className="!bg-[var(--brand-purple)] hover:!bg-[var(--brand-dark-purple)] font-semibold transition-all"
          >
            <Typography>Search {user}</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UserSearch;
