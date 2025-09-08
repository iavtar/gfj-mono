import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  InputAdornment,
  TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import { Formik, Form, Field } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import MaterialChange from "./MaterialChange";
import HeaderCard from "../../HeaderCard";
import apiClient from "../../../app/axiosConfig";
import { toast } from "react-toastify";
import MaterialSearch from "./MaterialSearch";

const columns = [
  { columnLabel: "Title", columnKey: "title" },
  { columnLabel: "Price", columnKey: "price" },
  { columnLabel: "Actions", columnKey: "actions" },
];

const Material = () => {
  const { user, token } = useSelector((state) => state.user.userDetails || {});
  const [materials, setMaterials] = useState([]);
  const [editMaterialData, seteditMaterialData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [serachPayload, setSearchPayload] = useState({});

  const fetchMaterials = useCallback(
    async (values = {}, currentPage = 1) => {
      try {
        const response = await apiClient.get("/businessAdmin/materials");
        setMaterials(response?.data);
        setPage(currentPage);
        setTotalPages(Math.ceil((response?.data?.totalRecords || 0) / pageSize));
      } catch (error) {
        console.error("Error fetching materials:", error);
        setMaterials([]);
        setTotalPages(0);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials, pageSize]);

  const handleAddOrUpdate = (material, isEdit) => {
    if (isEdit) {
      seteditMaterialData(material);
    } else {
      seteditMaterialData();
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    seteditMaterialData(null);
    fetchMaterials()
  };

  const handlePageChange = (direction) => {
    const newPage = direction === "next" ? page + 1 : page - 1;
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchMaterials({}, newPage);
  };

  const handleTablePaginationChange = (event, newPage) => {
    setPage(newPage + 1); // Convert 0-based to 1-based
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPageSize(newRowsPerPage);
    setPage(1); // Reset to first page when changing page size
    // The useEffect will trigger fetchMaterials with the new pageSize
  };

  const filteredMaterials = materials?.filter((material) =>
    columns
      .filter((col) => col.columnKey !== "actions")
      .some((col) =>
        String(material[col.columnKey] || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
  );

  const handleDeleteMaterial = async (materialObj) => {
    try {
      const response = await apiClient.delete(`/businessAdmin/deleteMaterial`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: Number(materialObj?.id),
        },
      });

      if (response?.status === 200) {
        fetchMaterials();
        toast.success(`Material deleted successfully`);
      } else {
        toast.error(`Failed to delete material`);
      }
    } catch (error) {
      console.error("Delete material failed:", error);
      toast.error("Something went wrong while deleting material");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-gray-50">
        <HeaderCard
          title={`Materials`}
          description={`Add or update materials`}
          icon="👥"
        />
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {searchOpen && (
          <Box className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
            <MaterialSearch
              setSearchPayload={setSearchPayload}
              setSearchOpen={setSearchOpen}
            />
          </Box>
        )}

        {/* Search Bar */}
        <Box className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
          <Box className="flex items-center gap-4">
            <TextField
              label="Search"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {/* <IconButton onClick={() => setSearchOpen(true)}>
                      <SearchIcon />
                    </IconButton> */}
                  </InputAdornment>
                ),
                sx: {
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
              sx={{ flex: 1 }}
            />

            <Button
              type="button"
              variant="contained"
              onClick={() => handleAddOrUpdate({}, false)}
              className="h-12 !bg-[var(--brand-purple)] hover:!bg-[var(--brand-dark-purple)]"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <AddIcon className="mr-2" />
              Add Material
            </Button>
          </Box>
        </Box>

        {/* Table Section */}
        <Card className="border border-gray-200 rounded-lg">
          <CardContent className="p-6">
            <Box className="flex justify-between items-center mb-6">
              <Typography
                variant="h5"
                className="text-[#4c257e] font-bold flex items-center"
              >
                Material List
              </Typography>
              {/* TablePagination */}
              <TablePagination
                component="div"
                count={filteredMaterials?.length || 0}
                page={page - 1} // Convert 1-based to 0-based
                onPageChange={handleTablePaginationChange}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{
                  border: "none",
                  "& .MuiTablePagination-toolbar": {
                    padding: 0,
                  },
                  "& .MuiTablePagination-selectLabel": {
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  },
                  "& .MuiTablePagination-displayedRows": {
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  },
                  "& .MuiTablePagination-actions": {
                    "& .MuiIconButton-root": {
                      color: "#4c257e",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                      "&.Mui-disabled": {
                        color: "#9ca3af",
                      },
                    },
                  },
                }}
              />
            </Box>
            <TableContainer
              component={Paper}
              className="border border-gray-200 rounded-lg"
            >
              <Table sx={{ minWidth: 650 }} aria-label="materials table">
                <TableHead>
                  <TableRow className="!bg-gradient-to-r !from-purple-50 !to-indigo-100">
                    {columns.map((col) => (
                      <TableCell
                        key={col.columnKey}
                        className="!font-bold !text-[#4c257e]"
                        sx={{
                          fontSize: "0.95rem",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {col.columnLabel}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMaterials
                    ?.slice((page - 1) * pageSize, page * pageSize)
                    .map((material, index) => (
                      <TableRow
                        key={material?.id}
                        className={`hover:!bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "!bg-white" : "!bg-gray-25"
                        }`}
                        sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                      >
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>
                          {material.title}
                        </TableCell>
                        <TableCell sx={{ padding: "12px 16px" }}>
                          <Typography
                            variant="body2"
                            className="font-semibold text-green-600"
                          >
                            ₹ {material?.price?.toFixed(2) || "0.00"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>
                          <EditIcon
                            style={{ cursor: "pointer", marginRight: 8 }}
                            color="primary"
                            onClick={() => handleAddOrUpdate(material, true)}
                            titleAccess="Edit"
                            sx={{
                              "&:hover": {
                                transform: "scale(1.1)",
                                transition: "transform 0.2s ease-in-out",
                              },
                            }}
                          />
                          <DeleteIcon
                            disabled={[1, 2, 3].includes(material?.id)}
                            style={{ cursor: [1, 2, 3].includes(material?.id) ? "not-allowed" : "pointer" }}
                            color={[1, 2, 3].includes(material?.id) ? "disabled" : "error"}
                            onClick={() => {
                              if ([1, 2, 3].includes(material?.id)) return;
                              handleDeleteMaterial(material);
                            }}
                            titleAccess={[1, 2, 3].includes(material?.id) ? "Delete (Disabled)" : "Delete"}
                            sx={{
                              opacity: [1, 2, 3].includes(material?.id) ? 0.5 : 1,
                              "&:hover": {
                                transform: [1, 2, 3].includes(material?.id) ? "none" : "scale(1.1)",
                                transition: [1, 2, 3].includes(material?.id) ? "none" : "transform 0.2s ease-in-out",
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>
      {/* Dialog remains unchanged */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: "rounded-xl shadow-lg p-4" }}
        TransitionProps={{ timeout: 300 }}
      >
        <Box className="flex justify-between items-center p-4">
          {editMaterialData && (
            <Typography variant="h6" className="text-[var(--brand-purple)]">
              Edit Material
            </Typography>
          )}
          {!editMaterialData && (
            <Typography variant="h6" className="text-[var(--brand-purple)]">
              Add Material
            </Typography>
          )}
          <IconButton onClick={handleDialogClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <MaterialChange
            materialData={editMaterialData}
            isEdit={editMaterialData ? true : false}
            handleDialogClose={handleDialogClose}
            onClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Material;
