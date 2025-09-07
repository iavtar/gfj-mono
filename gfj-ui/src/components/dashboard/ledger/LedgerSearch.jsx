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
  transactionId: "",
  description: "",
  startDate: null,
  endDate: null,
};

const LedgerSearch = ({setSearchPayload, setSearchOpen}) => {
  const { user } = useSelector((state) => state.user.userDetails || {});

  const createSearchPayload = async (values) => {
    const requestPayload = {
      transactionId: values?.transactionId,
      description: values?.description,
      createdAt: {
        startDate: values.startDate ? values.startDate.toDate().getTime() : null,
        endDate: values.endDate ? values.endDate.toDate().getTime() : null,
      },
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
              style={{ flex: "0 0 calc(50% - 8px)", width: "calc(50% - 8px)" }}
            >
              <TextField
                fullWidth
                label="Transaction ID"
                name="transactionId"
                value={formik.values.transactionId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.transactionId && Boolean(formik.errors.transactionId)}
                helperText={formik.touched.transactionId && formik.errors.transactionId}
              />
            </div>

            {/* Description */}
            <div
              style={{ flex: "0 0 calc(50% - 8px)", width: "calc(50% - 8px)" }}
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
            <Typography>Search Transaction</Typography>
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LedgerSearch;
