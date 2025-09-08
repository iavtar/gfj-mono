import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
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
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EyeIcon from "@mui/icons-material/Visibility";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import {toast} from "react-toastify"
import { Formik, Form, Field } from "formik";
import PhoneInput from "react-phone-input-2";
import HeaderCard from "../../HeaderCard";
import "react-phone-input-2/lib/material.css";
import ClientOnboarding from "./ClientOnboarding";
import apiClient from "../../../app/axiosConfig";
import ClientSearch from "./ClientSearch";

const columns = [
  { columnLabel: "Business Name", columnKey: "clientName" },
  { columnLabel: "Location", columnKey: "location" },
  { columnLabel: "Email", columnKey: "email" },
  // Add more columns as needed
  { columnLabel: "Actions", columnKey: "actions" },
];

const ClientAdministration = () => {
  const { roles, id } = useSelector((state) => state.user.userDetails || {});
  const [users, setUsers] = useState([]);
  const [editUserData, setEditUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dropdownUsers, setDropdownUsers] = useState({});
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPayload, setSearchPayload] = useState({});

  const fetchAllUsers = useCallback(async () => {
    const response = await apiClient.get(
      `businessAdmin/getAllAgents?offset=0&size=${pageSize}`
    );

    let userMap = {};
    if (response?.status === 200) {
      const userData = response?.data?.data;
      console.log(userData);
      userMap = {
        ...Object.fromEntries(userData.map((user) => [user.id, user.username])),
        all: "All",
      };
    }
    setDropdownUsers(userMap);
  }, []);

  const fetchUsers = useCallback(
    async (values = { agentId: "all" }, currentPage = 1) => {
      const offset = (currentPage - 1) * pageSize;
      let response;
      if (values?.agentId === "all" && roles[0] === "business_admin") {
        response = await apiClient.get(
          `businessAdmin/clients?offset=${offset}&size=${pageSize}`
        );
      } else {
        let agentId = id;
        if (roles[0] === "business_admin") {
          agentId = values?.agentId;
        }
        response = await apiClient.get(
          `agent/clients?agentId=${agentId}&offset=${offset}&size=${pageSize}`
        );
      }

      const users = response?.data?.data;
      const formattedUsers = users.map((user) => ({
        ...user,
        location: `${user?.businessAddress}, ${user?.city}, ${user?.state}, ${user?.country} - ${user?.zipCode}`,
      }));
      setUsers(formattedUsers);
      setTotalPages(Math.ceil(response?.data?.totalRecords / pageSize));
    },
    [id]
  );

  useEffect(() => {
    if (roles[0] === "business_admin") {
      fetchAllUsers();
    } else {
      setSelectedAgent(id)
    }
    fetchUsers();
  }, [fetchAllUsers, fetchUsers, id, roles]);

  const handleAddOrUpdate = (user, isEdit) => {
    if (isEdit) {
      setEditUserData(user);
    } else {
      setEditUserData();
    }
    setOpenDialog(true);
  };

  const handleShowInfo = (user, isEdit) => {
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
    fetchUsers({ agentId: selectedAgent })
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

  const handleAgentChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedAgent(selectedValue);
    fetchUsers({ agentId: selectedValue }, 1);
    setPage(1);
  };

  const handleDeleteClient = async (user) => {
    const response = await apiClient.delete(
      `/businessAdmin/deleteClient/${user?.id}`,
    );
    if (response?.status === 200) {
      fetchUsers();
      toast.success(`Client deleted successfully`);
    } else {
      toast.error(`Failed to delete client`);
    }
  }

  const filteredUsers = Array.isArray(users)
    ? users?.filter((user) =>
        columns
          .filter((col) => col.columnKey !== "actions")
          .some((col) =>
            String(user[col.columnKey] || "")
              .toLowerCase()
              .includes(search?.toLowerCase())
          )
      )
    : [];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-gray-50">
        <HeaderCard
          icon="👤"
          color="green"
          title="Client Administration"
          description="Manage client relationships and information"
        />
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {searchOpen && (
          <Box className="mb-6 p-6 bg-white rounded-lg border border-gray-200">
            <ClientSearch
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
              sx={{
                flex: 1,
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
            />

            {roles[0] === "business_admin" && (
              <FormControl
                variant="outlined"
                sx={{
                  minWidth: 200,
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
              >
                <Select
                  value={selectedAgent}
                  onChange={handleAgentChange}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <span className="text-gray-400">👤</span>
                    </InputAdornment>
                  }
                  sx={{
                    "& .MuiSelect-select": {
                      padding: "12px 16px",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    },
                  }}
                >
                  {Object.entries(dropdownUsers).map(([key, value]) => (
                    <MenuItem key={key} value={key} sx={{ fontSize: "0.875rem" }}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Tooltip
              title={
                selectedAgent === "all" ? "Select an agent to add client" : ""
              }
            >
              <span>
                <Button
                  type="button"
                  variant="contained"
                  disabled={
                    roles[0] === "business_admin" && selectedAgent === "all"
                  }
                  onClick={() => handleAddOrUpdate({}, false)}
                  className={`h-12
                    ${
                      selectedAgent === "all"
                        ? "!bg-gray-300 cursor-not-allowed"
                        : "!bg-[var(--brand-purple)] hover:!bg-[var(--brand-dark-purple)]"
                    }`}
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
                  Add Client
                </Button>
              </span>
            </Tooltip>
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
                Client List
              </Typography>
              {/* TablePagination */}
              <TablePagination
                component="div"
                count={filteredUsers.length || 0}
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
              <Table sx={{ minWidth: 650 }} aria-label="clients table">
                <TableHead>
                  <TableRow className="!bg-gradient-to-r !from-purple-50 !to-indigo-100">
                    {columns?.map((col) => (
                      <TableCell
                        key={col?.columnKey}
                        className="!font-bold !text-[#4c257e]"
                        sx={{ fontSize: "0.95rem", borderBottom: "1px solid #e5e7eb" }}
                      >
                        {col?.columnLabel}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice((page - 1) * pageSize, page * pageSize)
                    .map((user, index) => (
                      <TableRow
                        key={user?.id}
                        className={`hover:!bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "!bg-white" : "!bg-gray-25"
                        }`}
                        sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                      >
                        <TableCell className="!font-medium" sx={{ borderBottom: "1px solid #f3f4f6" }}>
                          {user?.clientName}
                        </TableCell>
                        <TableCell className="!font-medium" sx={{ borderBottom: "1px solid #f3f4f6" }}>
                          {user?.location}
                        </TableCell>
                        <TableCell className="!font-medium" sx={{ borderBottom: "1px solid #f3f4f6" }}>
                          {user?.email}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #f3f4f6" }}>
                          <EditIcon
                            style={{ cursor: "pointer", marginRight: 8 }}
                            color="primary"
                            onClick={() => handleAddOrUpdate(user, true)}
                            titleAccess="Edit"
                            sx={{
                              "&:hover": {
                                transform: "scale(1.1)",
                                transition: "transform 0.2s ease-in-out",
                              },
                            }}
                          />
                          {/* <EyeIcon
                            style={{ cursor: "pointer", marginRight: 8 }}
                            color="action"
                            onClick={() => handleShowInfo(user, true)}
                            titleAccess="Preview"
                            sx={{
                              "&:hover": {
                                transform: "scale(1.1)",
                                transition: "transform 0.2s ease-in-out",
                              },
                            }}
                          /> */}
                          <DeleteIcon
                            style={{ cursor: "pointer" }}
                            color="error"
                            onClick={() => {
                              handleDeleteClient(user);
                            }}
                            titleAccess="Delete"
                            sx={{
                              "&:hover": {
                                transform: "scale(1.1)",
                                transition: "transform 0.2s ease-in-out",
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
          <Typography variant="h6" className="text-[#4c257e]">
            {roles[0] === "business_admin"
              ? editUserData
                ? `Edit Client for ${dropdownUsers[selectedAgent]}`
                : `Add Client for ${dropdownUsers[selectedAgent]}`
              : editUserData
              ? "Edit Client"
              : "Add Client"}
          </Typography>
          <IconButton onClick={handleDialogClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <ClientOnboarding
            agentId={selectedAgent}
            agentUserName={dropdownUsers[selectedAgent] || "Agent"}
            clientData={editUserData}
            isEdit={editUserData ? true : false}
            handleDialogClose={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientAdministration;
