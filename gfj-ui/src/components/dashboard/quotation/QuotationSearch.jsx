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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const initialFormData = {
  quotationId: "",
  trackingId: "",
  description: "",
  startDate: null,
  endDate: null,
};

const QuotationSearch = ({setSearchPayload, setSearchOpen}) => {
  const { user } = useSelector((state) => state.user.userDetails || {});

  const formatLocalDateTime = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return (
      d.getFullYear() +
      "-" + String(d.getMonth() + 1).padStart(2, "0") +
      "-" + String(d.getDate()).padStart(2, "0") +
      "T" + String(d.getHours()).padStart(2, "0") +
      ":" + String(d.getMinutes()).padStart(2, "0") +
      ":" + String(d.getSeconds()).padStart(2, "0")
    );
  };

  const createSearchPayload = async (values) => {
    const requestPayload = {
      quotationId: values?.quotationId,
      description: values?.description,
      trackingId: values?.trackingId,
      createdAfter: values.startDate ? formatLocalDateTime(values.startDate) : null,
      createdBefore: values.endDate ? formatLocalDateTime(values.endDate) : null,
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              width: "100%",
            }}
          >
            {/* Transaction ID */}
            <div
              style={{ flex: "0 0 calc(33% - 8px)", width: "calc(33% - 8px)" }}
            >
              <TextField
                fullWidth
                label="Quotation ID"
                name="quotationId"
                value={formik.values.quotationId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quotationId && Boolean(formik.errors.quotationId)}
                helperText={formik.touched.quotationId && formik.errors.quotationId}
              />
            </div>

            <div
              style={{ flex: "0 0 calc(33% - 8px)", width: "calc(33% - 8px)" }}
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

            {/* Description */}
            <div
              style={{ flex: "0 0 calc(33% - 8px)", width: "calc(33% - 8px)" }}
            >
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </div>
          </div>

          <Typography variant="h6" className="text-[#4c257e] font-bold !mt-4 !mb-2">
            Create date
          </Typography>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              width: "100%",
            }}
          >
            {/* Start Date */}
            <div
              style={{ flex: "0 0 calc(15% - 50px)", width: "calc(15% - 50px)" }}
            >
              <DatePicker
                name="startDate"
                label="Start Date"
                value={formik.values.startDate}
                onChange={(newValue) => {
                  formik.setFieldValue('startDate', newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>

            {/* End Date */}
            <div
              style={{ flex: "0 0 calc(15% - 12px)", width: "calc(15% - 12px)" }}
            >
              <DatePicker
                name="endDate"
                label="End Date"
                value={formik.values.endDate}
                onChange={(newValue) => {
                  formik.setFieldValue('endDate', newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
          </div>
        </LocalizationProvider>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            className="!bg-[var(--brand-purple)] hover:!bg-[var(--brand-dark-purple)] font-semibold transition-all"
          >
            <Typography>Search Quotations</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default QuotationSearch;
