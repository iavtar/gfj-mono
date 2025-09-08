import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { toast } from "react-toastify";
import apiClient from "../../../app/axiosConfig";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  price: Yup.string().required("Price is required"),
});

const initialFormData = {
  title: "",
  price: "",
};

const MaterialChange = ({ materialData, isEdit, handleDialogClose }) => {
  const { token } = useSelector((state) => state.user.userDetails || {});

  const addEditMaterial = async (values) => {
    const requestBody = {
      id: materialData?.id,
      title: values?.title,
      price: values?.price,
    };

    let response;

    if (isEdit) {
      console.log("Inside edit", values);
      response = await apiClient.post(
        `/businessAdmin/updateMaterial`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        toast.success(`Material Updated Successfully!`);
        handleDialogClose();
      } else {
        toast.error(`Failed to Update Material!`);
      }
    } else {
      response = await apiClient.post(
        `/businessAdmin/material`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        toast.success(`Material Added Successfully!`);
        handleDialogClose();
      } else {
        toast.error(`Failed to Add Material!`);
      }
    }
  };

  const formik = useFormik({
    initialValues: { ...initialFormData, ...materialData },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      addEditMaterial(values);
      // formik.resetForm();
    },
  });

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            width: "100%",
          }}
        >
          {/* title */}
          <div
            style={{ flex: "0 0 calc(50% - 12px)", width: "calc(50% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </div>

          {/* Price */}
          <div
            style={{ flex: "0 0 calc(50% - 12px)", width: "calc(50% - 12px)" }}
          >
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              InputProps={formik.values.price && {
                startAdornment: (
                  <InputAdornment position="start">
                    ₹
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>

        <Box mt={4}>
          <Button
            variant="contained"
            type="submit"
            className="!bg-[var(--brand-purple)] hover:!bg-[var(--brand-dark-purple)] font-semibold transition-all"
          >
            {isEdit && <Typography>Edit Material</Typography>}
            {!isEdit && <Typography>Add Material</Typography>}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default MaterialChange;
