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
  clientName: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  phoneNumber: "",
  businessAddress: "",
  shippingAddress: "",
  email: "",
  taxId: "",
  einNumber: "",
};

const ClientSearch = ({setSearchPayload, setSearchOpen}) => {
  const { user } = useSelector((state) => state.user.userDetails || {});

  const createSearchPayload = async (values) => {
    const requestPayload = {
      clientName: values?.clientName,
      city: values?.city,
      state: values?.state,
      country: values?.country,
      zipCode: values?.zipCode,
      phoneNumber: values?.phoneNumber,
      businessAddress: values?.businessAddress,
      shippingAddress: values?.shippingAddress,
      email: values?.email,
      taxId: values?.taxId,
      einNumber: values?.einNumber,
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
          {/* Client Name */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Client Name"
              name="clientName"
              value={formik.values.clientName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.clientName && Boolean(formik.errors.clientName)}
              helperText={formik.touched.clientName && formik.errors.clientName}
            />
          </div>

          {/* City */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
            />
          </div>

          {/* State */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && Boolean(formik.errors.state)}
              helperText={formik.touched.state && formik.errors.state}
            />
          </div>

          {/* Country */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.country && Boolean(formik.errors.country)}
              helperText={formik.touched.country && formik.errors.country}
            />
          </div>

          {/* Zip Code */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Zip Code"
              name="zipCode"
              value={formik.values.zipCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
              helperText={formik.touched.zipCode && formik.errors.zipCode}
            />
          </div>

          {/* Phone Number */}
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

          {/* Business Address */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Business Address"
              name="businessAddress"
              value={formik.values.businessAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.businessAddress && Boolean(formik.errors.businessAddress)}
              helperText={formik.touched.businessAddress && formik.errors.businessAddress}
            />
          </div>

          {/* Shipping Address */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Shipping Address"
              name="shippingAddress"
              value={formik.values.shippingAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.shippingAddress && Boolean(formik.errors.shippingAddress)}
              helperText={formik.touched.shippingAddress && formik.errors.shippingAddress}
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

          {/* Tax ID */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Tax ID"
              name="taxId"
              value={formik.values.taxId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.taxId && Boolean(formik.errors.taxId)}
              helperText={formik.touched.taxId && formik.errors.taxId}
            />
          </div>

          {/* EIN Number */}
          <div
            style={{ flex: "0 0 calc(25% - 12px)", width: "calc(25% - 12px)" }}
          >
            <TextField
              fullWidth
              label="EIN Number"
              name="einNumber"
              value={formik.values.einNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.einNumber && Boolean(formik.errors.einNumber)}
              helperText={formik.touched.einNumber && formik.errors.einNumber}
            />
          </div>
        </div>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            className="!bg-[var(--brand-purple)] hover:!bg-[var(--brand-dark-purple)] font-semibold transition-all"
          >
            <Typography>Search Client</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ClientSearch;
