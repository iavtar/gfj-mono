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
import UserOnboarding from "./UserOnboarding";
import HeaderCard from "../../HeaderCard";
import apiClient from "../../../app/axiosConfig";
import { toast } from "react-toastify";
import UserSearch from "./UserSearch";

const columns = [
  { columnLabel: "First Name", columnKey: "firstName" },
  { columnLabel: "Last Name", columnKey: "lastName" },
  { columnLabel: "Username", columnKey: "username" },
  { columnLabel: "Email", columnKey: "email" },
  { columnLabel: "Phone Number", columnKey: "phoneNumber" },
  { columnLabel: "Actions", columnKey: "actions" },
];

const UserAdministration = () => {
  const { user, token } = useSelector((state) => state.user.userDetails || {});
  const [users, setUsers] = useState([]);
  const [editUserData, setEditUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [serachPayload, setSearchPayload] = useState({});

  const fetchUsers = useCallback(async (values = {}, currentPage = 1) => {
    console.log(values);
    const offset = (currentPage - 1) * pageSize;

    let response
    if (user === "Agent") {
      response = await apiClient.get(
        `/businessAdmin/getAllAgents?offset=${offset}&size=${pageSize}`
      );
    } else if (user === "Business Admin"){
      response = await apiClient.get(
        `/systemAdministration/getAllUser?offset=${offset}&size=${pageSize}`
      );
    }
    console.log("Response", response);
    setUsers(response?.data?.data);
    setTotalPages(Math.ceil(response?.data?.totalRecords / pageSize));
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, pageSize]);

  const handleAddOrUpdate = (user, isEdit) => {
    console.log(`${user}`, user);
    if (isEdit) {
      setEditUserData(user);
    } else {
      setEditUserData();
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditUserData(null);
    fetchUsers()
  };

  const handlePageChange = (direction) => {
    const newPage = direction === "next" ? page + 1 : page - 1;
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchUsers({}, newPage);
  };

  const handleTablePaginationChange = (event, newPage) => {
    setPage(newPage + 1); // Convert 0-based to 1-based
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPageSize(newRowsPerPage);
    setPage(1); // Reset to first page when changing page size
    // The useEffect will trigger fetchUsers with the new pageSize
  };

  const filteredUsers = users?.filter((user) =>
    columns
      .filter((col) => col.columnKey !== "actions")
      .some((col) =>
        String(user[col.columnKey] || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
  );

  useEffect(() => {
    console.log(serachPayload);
  }, [serachPayload]);

  const handleToggle = async (user, isActive) => {
    const requestBody = {
      id: user?.id,
      active: isActive,
    };

    const response = await apiClient.post(
      `/businessAdmin/updateAgent`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("Response Update", response);

    if (response?.status === 200) {
      fetchUsers();
      toast.success("Status updated successfully");
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteUser = async (userObj) => {
    const response = await apiClient.delete(
      `/businessAdmin/deleteAgent/${userObj?.id}`,
    );
    if (response?.status === 200) {
      fetchUsers();
      toast.success(`${user} deleted successfully`);
    } else {
      toast.error(`Failed to delete ${user}`);
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-gray-50">
        <HeaderCard
          title={`${user} Administration`}
          description={`Manage ${user} and their permissions`}
          icon="👥"
        />
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {searchOpen && (
          <Box className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
            <UserSearch setSearchPayload={setSearchPayload} setSearchOpen={setSearchOpen}/>
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
              Add {user}
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
                {user} List
              </Typography>
              {/* TablePagination */}
              <TablePagination
                component="div"
                count={filteredUsers?.length || 0}
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
            <TableContainer component={Paper} className="border border-gray-200 rounded-lg">
              <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead>
                  <TableRow className="!bg-gradient-to-r !from-purple-50 !to-indigo-100">
                    {columns.map((col) => (
                      <TableCell
                        key={col.columnKey}
                        className="!font-bold !text-[#4c257e]"
                        sx={{ fontSize: "0.95rem", borderBottom: "1px solid #e5e7eb" }}
                      >
                        {col.columnLabel}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    ?.slice((page - 1) * pageSize, page * pageSize)
                    .map((user, index) => (
                      <TableRow
                        key={user?.id}
                        className={`hover:!bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "!bg-white" : "!bg-gray-25"
                        }`}
                        sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                      >
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>{user.firstName}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>{user.lastName}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>{user.username}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>{user.email}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>{user.phoneNumber}</TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>
                          <EditIcon
                            style={{ cursor: "pointer", marginRight: 8 }}
                            color="primary"
                            onClick={() => handleAddOrUpdate(user, true)}
                            titleAccess="Edit"
                            sx={{
                              '&:hover': {
                                transform: 'scale(1.1)',
                                transition: 'transform 0.2s ease-in-out',
                              }
                            }}
                          />
                          {user?.isActive ? (
                            <ToggleOnIcon
                              style={{
                                cursor: "pointer",
                                marginRight: 8,
                                color: "green",
                              }}
                              color="action"
                              onClick={() => {
                                handleToggle(user, false);
                              }}
                              titleAccess="Status"
                              sx={{
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  transition: 'transform 0.2s ease-in-out',
                                }
                              }}
                            />
                          ) : (
                            <ToggleOffIcon
                              style={{
                                cursor: "pointer",
                                marginRight: 8,
                                color: "red",
                              }}
                              color="action"
                              onClick={() => {
                                handleToggle(user, true);
                              }}
                              titleAccess="Status"
                              sx={{
                                '&:hover': {
                                  transform: 'scale(1.1)',
                                  transition: 'transform 0.2s ease-in-out',
                                }
                              }}
                            />
                          )}
                          <DeleteIcon
                            style={{ cursor: "pointer" }}
                            color="error"
                            onClick={() => {
                              handleDeleteUser(user)
                            }}
                            titleAccess="Delete"
                            sx={{
                              '&:hover': {
                                transform: 'scale(1.1)',
                                transition: 'transform 0.2s ease-in-out',
                              }
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
          {editUserData && (
            <Typography variant="h6" className="text-[var(--brand-purple)]">
              Edit {user}
            </Typography>
          )}
          {!editUserData && (
            <Typography variant="h6" className="text-[var(--brand-purple)]">
              Add {user}
            </Typography>
          )}
          <IconButton onClick={handleDialogClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <UserOnboarding
            userData={editUserData}
            isEdit={editUserData ? true : false}
            onClose={handleDialogClose}
            handleDialogClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAdministration;
