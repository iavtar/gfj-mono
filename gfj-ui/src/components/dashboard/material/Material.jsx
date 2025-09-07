import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "react-phone-input-2/lib/material.css";
import HeaderCard from "../../HeaderCard";
import apiClient from "../../../app/axiosConfig";
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  flex: 1,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 400,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
}));

const Material = () => {
  const { user, token } = useSelector((state) => state.user.userDetails || {});
  const [materials, setMaterials] = useState([]);
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await apiClient.get("/businessAdmin/materials");
        console.log("Materials:", response?.data);
        setMaterials(response?.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, [token]);

  useEffect(() => {
    if (materials.length > 0) {
      setPrice(materials[0].price.toString());
    }
  }, [materials]);

  const handleUpdate = async () => {
    const updatedMaterials = materials.map((material) =>
      material.id === 1 ? { ...material, price: parseFloat(price) } : material
    );
    setMaterials(updatedMaterials);

    const requestBody = {
      materials: updatedMaterials,
    };

    try {
      const response = await apiClient.post(
        `/businessAdmin/updateMaterials`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.status === 200) {
        toast.success("Material updated successfully");
      } else {
        toast.error("Failed to update material");
      }
    } catch (error) {
      toast.error("Failed to update material");
    }
  };

  return (
    <Box className="bg-white h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <HeaderCard
          icon="💍"
          title={`Material`}
          description={"Update material price"}
        />
      </div>
      <StyledContainer>
        <StyledPaper elevation={0} sx={{ border: "1px solid #e5e7eb", boxShadow: "none" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              mb: 3,
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '1px',
            }}
          >
            Gold Price
          </Typography>
          <Box component="form" sx={{ mt: 1, width: "100%" }} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Gold Price"
              name="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    ₹
                  </Typography>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f8fafc",
                  "&:hover fieldset": {
                    borderColor: "#4c257e",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4c257e",
                  },
                },
              }}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #764ba2 30%, #667eea 90%)",
                  boxShadow: "none",
                  transform: "translateY(-1px)",
                },
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                borderRadius: "8px",
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
              }}
              onClick={handleUpdate}
            >
              Update Price
            </Button>
          </Box>
        </StyledPaper>
      </StyledContainer>
    </Box>
  );
};

export default Material;
