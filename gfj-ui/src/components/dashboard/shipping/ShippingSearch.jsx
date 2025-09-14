import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

const initialFormData = {
  shippingId: "",
  trackingId: "",
  invoiceNumber: "",
  note: "",
};

const ShippingSearch = ({setSearchPayload, setSearchOpen}) => {
  const { user } = useSelector((state) => state.user.userDetails || {});

  const createSearchPayload = async (values) => {
    const requestPayload = {
      shippingId: values?.shippingId,
      trackingId: values?.trackingId,
      invoiceNumber: values?.invoiceNumber,
      trackingNote: values?.note,
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
          {/* Shipping ID */}
          <div
            style={{ flex: "0 0 calc(33% - 10px)", width: "calc(33% - 10px)" }}
          >
            <TextField
              fullWidth
              label="Shipping ID"
              name="shippingId"
              value={formik.values.shippingId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.shippingId && Boolean(formik.errors.shippingId)}
              helperText={formik.touched.shippingId && formik.errors.shippingId}
            />
          </div>

          {/* Tracking ID */}
          <div
            style={{ flex: "0 0 calc(33% - 10px)", width: "calc(33% - 10px)" }}
          >
            <TextField
              fullWidth
              label="Tracking ID"
              name="trackingId"
              value={formik.values.trackingId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.trackingId && Boolean(formik.errors.trackingId)}
              helperText={formik.touched.trackingId && formik.errors.trackingId}
            />
          </div>

          {/* Invoice Number */}
          <div
            style={{ flex: "0 0 calc(33% - 10px)", width: "calc(33% - 10px)" }}
          >
            <TextField
              fullWidth
              label="Invoice Number"
              name="invoiceNumber"
              value={formik.values.invoiceNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.invoiceNumber && Boolean(formik.errors.invoiceNumber)}
              helperText={formik.touched.invoiceNumber && formik.errors.invoiceNumber}
            />
          </div>

          {/* Note */}
          <div
            style={{ flex: "0 0 calc(33% - 10px)", width: "calc(33% - 10px)" }}
          >
            <TextField
              fullWidth
              label="Note"
              name="note"
              value={formik.values.note}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.note && Boolean(formik.errors.note)}
              helperText={formik.touched.note && formik.errors.note}
            />
          </div>
        </div>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            className="!bg-[var(--brand-purple)] hover:!bg-[var(--brand-dark-purple)] font-semibold transition-all"
          >
            <Typography>Search Shipping</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ShippingSearch;
