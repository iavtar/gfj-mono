import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
  TablePagination
} from "@mui/material";
import { toast } from "react-toastify";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import HeaderCard from "../../HeaderCard";
import GemLoader from "../../loader/GemLoader";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import apiClient from "../../../app/axiosConfig";
import LedgerStats from "./LedgerStats";
import LedgerSearch from "./LedgerSearch";

const columns = [
  { columnLabel: "Transaction ID", columnKey: "transactionId" },
  { columnLabel: "Created At", columnKey: "createDate" },
  { columnLabel: "Amount", columnKey: "amount" },
  { columnLabel: "Transaction Type", columnKey: "transactionType" },
  { columnLabel: "Description", columnKey: "description" },
  { columnLabel: "Note", columnKey: "note" },
  { columnLabel: "Action", columnKey: "action" },
];

const LedgerTracker = () => {
  const { token, id, roles } = useSelector(
    (state) => state.user.userDetails || {}
  );
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchPayload, setSearchPayload] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState(
    ["business_admin", "shipper"].includes(roles?.[0]) ? "all" : id
  );
  const [selectedClient, setSelectedClient] = useState("");
  const [dropdownUsers, setDropdownUsers] = useState({});
  const [dropdownClients, setClientDropdown] = useState({});
  const [ledgerDetails, setLedgerDetails] = useState({});

  // Dialog state for adding ledger
  const [openAddLedgerDialog, setOpenAddLedgerDialog] = useState(false);
  const [ledgerFormData, setLedgerFormData] = useState({
    amount: "",
    transactionType: "",
    note: "",
    description: "",
  });
  const [ledgerFormErrors, setLedgerFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pageSize, setPageSize] = useState(100);

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `businessAdmin/getAllAgents?offset=0&size=100`
      );

      let userMap = {};
      if (response?.status === 200) {
        const userData = response?.data?.data;
        userMap = {
          ...Object.fromEntries(
            userData.map((user) => [user.id, user.username])
          ),
          all: "All",
        };
      }
      setDropdownUsers(userMap);
    } catch (error) {
      setDropdownUsers({ all: "All" });
      console.error("Error fetching agents:", error);
    }
  }, []);

  const fetchClients = useCallback(async (agentId, shouldAutoSelect = true) => {
    try {
      let response;
      if (agentId === "all" && ["business_admin", "shipper"].includes(roles?.[0])) {
        response = await apiClient.get(`/businessAdmin/clients`);
      } else {
        response = await apiClient.get(
          `agent/clients?agentId=${agentId}&offset=0&size=100`
        );
      }

      let clientMap = {};
      if (response?.status === 200) {
        const clientData = response?.data?.data || [];
        if (clientData.length > 0) {
          clientMap = {
            ...Object.fromEntries(
              clientData.map((client) => [
                client?.id,
                client?.clientName || client?.name,
              ])
            ),
          };
          // Set the first client as selected by default only on initial load
          if (shouldAutoSelect && (!selectedClient || selectedClient === "all")) {
            const firstClientId = Object.keys(clientMap)[0];
            setSelectedClient(firstClientId);
          }
        } else {
          // No clients available
          clientMap = {};
          if (shouldAutoSelect) {
            setSelectedClient("");
          }
        }
      }
      setClientDropdown(clientMap);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClientDropdown({});
      if (shouldAutoSelect) {
        setSelectedClient("");
      }
      toast.error("Failed to load clients. Please try again.");
    }
  }, [selectedClient]);

  const fetchLedgers = useCallback(
    async (currentPage = 1) => {
      // Don't fetch if no client is selected
      if (!selectedClient) {
        setLedgers([]);
        setTotalRecords(0);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * pageSize;
        const response = await apiClient.get(
          `/client-ledger/client/${selectedClient}?offset=${offset}&size=${pageSize}`
        );

        if (response?.data && response?.status === 200) {
          setLedgerDetails(response?.data);
          const fetchedLedgers = response?.data?.transactions || [];
          setLedgers(fetchedLedgers);
          setTotalRecords(response?.data?.totalElements || 0);
          setTotalPages(Math.ceil((response?.data?.totalElements || 0) / pageSize));
        }
      } catch (err) {
        console.error("Error fetching ledgers:", err);
        setError("Failed to fetch ledgers. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [id, pageSize, roles, selectedAgent, selectedClient]
  );

  useEffect(() => {
    if (["business_admin", "shipper"].includes(roles?.[0])) {
      fetchAllUsers();
    }
    fetchClients(selectedAgent);
    fetchLedgers(page);
  }, [fetchLedgers, page, roles, fetchAllUsers, fetchClients, selectedAgent, selectedClient]);

  const handlePageChange = (direction) => {
    const newPage = direction === "next" ? page + 1 : page - 1;
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleTablePaginationChange = (event, newPage) => {
    setPage(newPage + 1); // Convert 0-based to 1-based
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 100);
    setPageSize(newRowsPerPage);
    setPage(1); // Reset to first page when changing page size
    // The useEffect will trigger fetchLedgers with the new pageSize
  };

  const handleAgentChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedAgent(selectedValue);
    setPage(1);
    fetchClients(selectedValue);
  };

  const handleClientChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedClient(selectedValue);
    setPage(1);
    // Don't call fetchClients here to avoid resetting client selection
    // fetchClients(selectedValue, false); // Only pass false to prevent auto-selection
  };

  const handleAddLedger = () => {
    setLedgerFormData({
      amount: "",
      transactionType: "",
      note: "",
      description: "",
    });
    setLedgerFormErrors({});
    setOpenAddLedgerDialog(true);
  };

  const validateLedgerForm = () => {
    const errors = {};

    if (!ledgerFormData.amount || ledgerFormData.amount <= 0) {
      errors.amount = "Amount must be greater than 0";
    }

    if (!ledgerFormData.transactionType) {
      errors.transactionType = "Transaction type is required";
    } else if (!["CREDIT", "DEBIT"].includes(ledgerFormData.transactionType.toUpperCase())) {
      errors.transactionType = "Transaction type must be either CREDIT or DEBIT";
    }

    // if (!ledgerFormData.note || ledgerFormData.note.trim().length === 0) {
    //   errors.note = "Note is required";
    // }

    if (!ledgerFormData.description || ledgerFormData.description.trim().length === 0) {
      errors.description = "Description is required";
    }

    setLedgerFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLedgerFormChange = (field, value) => {
    setLedgerFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (ledgerFormErrors[field]) {
      setLedgerFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleAddLedgerSubmit = async () => {
    if (!validateLedgerForm()) {
      return;
    }

    if (!selectedClient) {
      toast.error("Please select a specific client to add a transaction");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        clientId: selectedClient,
        amount: parseFloat(ledgerFormData.amount),
        transactionType: ledgerFormData.transactionType.toUpperCase(),
        note: ledgerFormData.note.trim(),
        description: ledgerFormData.description.trim(),
      };

      const response = await apiClient.post(`/client-ledger/transaction`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Transaction added successfully!");
        setOpenAddLedgerDialog(false);
        setLedgerFormData({
          amount: "",
          transactionType: "",
          note: "",
          description: "",
        });
      } else {
        toast.error("Failed to add transaction. Please try again.");
      }

    } catch (error) {
      console.error("Error adding ledger transaction:", error);
      toast.error("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
      fetchLedgers(page);
    }
  };

  const handleAddLedgerDialogClose = () => {
    if (!isSubmitting) {
      setOpenAddLedgerDialog(false);
      setLedgerFormErrors({});
      setLedgerFormData({
        amount: "",
        transactionType: "",
        note: "",
        description: "",
      });
    }
    fetchLedgers(page);
  };

  const filteredLedgers = ledgers.filter((q) => {
    const searchMatch = searchTerm
      ? JSON.stringify(q).toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // For ledger data, we don't have agent information in the transaction records
    // So agent filtering is not applicable for ledger transactions
    const agentMatch = true; // Always true since we don't filter by agent in ledger

    // Convert statusFilter to uppercase to match transactionType format
    const statusMatch = statusFilter === "all" ||
      q?.transactionType?.toLowerCase() === statusFilter.toLowerCase();

    // For ledger data, client filtering happens at the API level
    // Since we're fetching data for a specific client, all records belong to that client
    const clientMatch = true; // Always true since API filters by client

    return searchMatch && agentMatch && statusMatch && clientMatch;
  });

  const clientDetailFields = [
    { label: "Client", key: "clientName", fallback: "Unknown Client" },
    { label: "Email", key: "email", fallback: "No Email" },
    {
      label: "Shipping Address",
      key: "shippingAddress",
      fallback: "No Shipping Address",
    },
    { label: "City", key: "city", fallback: "No City" },
    { label: "State", key: "state", fallback: "No State" },
    { label: "Country", key: "country", fallback: "No Country" },
    { label: "Zip Code", key: "zipCode", fallback: "No Zip Code" },
    { label: "EIN Number", key: "einNumber", fallback: "No EIN Number" },
  ];

  const handleDelete = async (ledger) => {
      setLoading(true);
        setError(null);
        try {
          const response = await apiClient.delete(
            `agent/deleteLedger?ledgerId=${ledger?.quotationId}`
          );
          if (response?.status === 200){
            toast.success(`Transaction Deleted Successfully!`)
            fetchLedgers(page);
          } else {
            toast.error(`Failed To Delete Transaction!`)
          }
        } catch (err) {
          console.error("Error Deleting Transaction:", err);
          setError("Failed to delete transaction. Please try again.");
          toast.error("Failed to delete transaction. Please try again.");
        } finally {
          setLoading(false);
        }
    };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header Section - Sticky */}
      <div className="sticky top-0 z-10 bg-gray-50">
        <HeaderCard
          icon="📒"
          color="teal"
          title="Ledger Tracker"
          description="Track and Manage Ledgers"
        />
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <Card className="border border-gray-200 rounded-lg mb-6">
          <div className="mt-4 p-4">
            <LedgerStats ledgers={ledgerDetails} />
          </div>
          <CardContent className="p-6">
            {searchOpen && (
              <Box className="mb-6 p-6 bg-white rounded-lg border border-gray-200 mx-4">
                <LedgerSearch
                  setSearchPayload={setSearchPayload}
                  setSearchOpen={setSearchOpen}
                />
              </Box>
            )}
            <Box className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <Box className="flex-1 w-full md:w-auto">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search ledgers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                />
              </Box>

              {/* Agent Filter - Only for business_admin */}
              {["business_admin", "shipper"].includes(roles?.[0]) && (
                <Box className="w-full md:w-48">
                  <FormControl fullWidth variant="outlined">
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
                        borderRadius: "8px",
                        backgroundColor: "#f8fafc",
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "#4c257e",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#4c257e",
                          },
                        },
                      }}
                    >
                      {Object.entries(dropdownUsers).map(([key, value]) => (
                        <MenuItem
                          key={key}
                          value={key}
                          sx={{ fontSize: "0.875rem" }}
                        >
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Client Filter */}
              <Box className="w-full md:w-48">
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={selectedClient}
                    onChange={handleClientChange}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <span className="text-gray-400">👤</span>
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#f8fafc",
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#4c257e",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4c257e",
                        },
                      },
                    }}
                  >
                    {Object.entries(dropdownClients).map(([key, value]) => (
                      <MenuItem
                        key={key}
                        value={key}
                        sx={{ fontSize: "0.875rem" }}
                      >
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Status Filter */}
              <Box className="w-full md:w-48">
                <FormControl fullWidth variant="outlined">
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterListIcon className="text-gray-400" />
                      </InputAdornment>
                    }
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#f8fafc",
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#4c257e",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4c257e",
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box className="w-full md:w-48">
                <Button
                  type="button"
                  variant="contained"
                  disabled={!selectedClient}
                  onClick={() => handleAddLedger()}
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
                  Add Ledger
                </Button>
              </Box>

              {/* Results Count */}
              {/* <Box className="text-center md:text-right">
                <Typography variant="body2" className="text-gray-600">
                  Showing {filteredLedgers.length} of {totalRecords} results
                </Typography>
              </Box> */}
            </Box>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Main Table Card */}
        <Card className="border border-gray-200 rounded-lg">
          <CardContent>
            {/* Table Header */}
            <Box className="flex justify-between items-center mb-4">
              <Typography
                variant="h5"
                className="text-[#4c257e] font-bold flex items-center"
              >
                <ImageIcon className="mr-2" />
                Ledger List
              </Typography>

              {/* TablePagination */}
              <TablePagination
                component="div"
                count={totalRecords}
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

            {/* Loading State */}
            {loading && (
              <Box className="flex justify-center items-center py-8">
                <GemLoader size={30} />
              </Box>
            )}

            {/* Table */}
            {!loading && ledgers.length > 0 && (
              <TableContainer
                component={Paper}
                className="shadow-md"
                sx={{
                  maxHeight: "70vh",
                  overflow: "auto",
                  "& .MuiTable-root": {
                    borderCollapse: "separate",
                    borderSpacing: 0,
                  },
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#a8a8a8",
                    },
                  },
                }}
              >
                <Table
                  stickyHeader
                  sx={{ minWidth: 650 }}
                  aria-label="ledgers table"
                >
                  <TableHead>
                    <TableRow className="!bg-gradient-to-r !from-purple-100 !to-indigo-200">
                      {columns?.map((col) => {
                        return (
                          <TableCell
                            key={col.columnKey}
                            className="!font-bold !text-[#4c257e]"
                            sx={{
                              fontSize: "0.95rem",
                              backgroundColor: "#f8fafc",
                              borderBottom: "2px solid #e5e7eb",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              padding: "12px 16px",
                              fontWeight: 600,
                              width: "auto",
                            }}
                          >
                            {col.columnLabel}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLedgers?.map((ledger, index) => (
                      <TableRow
                        key={ledger?.transactionId}
                        className={`hover:!bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "!bg-white" : "!bg-gray-25"
                        }`}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f9fafb",
                          },
                        }}
                      >
                        <TableCell
                          className="!font-medium"
                          sx={{ padding: "12px 16px" }}
                        >
                          {ledger?.transactionId}
                        </TableCell>
                        <TableCell
                          className="!font-medium"
                          sx={{ padding: "12px 16px" }}
                        >
                          {ledger?.createdAt}
                        </TableCell>
                        <TableCell sx={{ padding: "12px 16px" }}>
                          <Typography
                            variant="body2"
                            className="font-semibold text-green-600"
                          >
                            $ {ledger?.amount?.toFixed(2) || "0.00"}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ padding: "12px 16px" }}>
                          <Chip
                            label={ledger?.transactionType}
                            sx={{
                              width: 100,
                              fontWeight: "bold",
                              color: "#fff",
                              backgroundColor:
                                ledger?.transactionType === "DEBIT"
                                  ? "#e53935"
                                  : "#43a047",
                              "& .MuiChip-label": {
                                width: "100%",
                                textAlign: "center",
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell
                          className="!font-medium"
                          sx={{ padding: "12px 16px" }}
                        >
                          {ledger?.description}
                        </TableCell>
                        <TableCell
                          className="!font-medium"
                          sx={{ padding: "12px 16px" }}
                        >
                          {ledger?.note}
                        </TableCell>
                        <TableCell sx={{ padding: "12px 16px" }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <DeleteIcon
                              style={{ cursor: "pointer" }}
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(ledger);
                              }}
                              titleAccess="Delete"
                              sx={{
                                "&:hover": {
                                  transform: "scale(1.1)",
                                  transition: "transform 0.2s ease-in-out",
                                },
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Empty State - No client selected */}
            {!loading && ledgers.length === 0 && !selectedClient && (
              <Box className="text-center py-12">
                <ImageIcon className="!text-6xl text-gray-300 mb-4" />
                <Typography variant="h6" className="text-gray-500 mb-2">
                  No clients found
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  No clients are available for the selected agent.
                </Typography>
              </Box>
            )}

            {/* Empty State - Client selected but no transactions */}
            {!loading && ledgers.length === 0 && selectedClient && (
              <Box className="text-center py-12">
                <ImageIcon className="!text-6xl text-gray-300 mb-4" />
                <Typography variant="h6" className="text-gray-500 mb-2">
                  {searchTerm || statusFilter !== "all"
                    ? "No matching transactions found"
                    : "No transactions found for this client"}
                </Typography>
                <Typography variant="body2" className="text-gray-400">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search criteria or filters."
                    : "This client doesn't have any transactions yet."}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Add Ledger Dialog */}
        <Dialog
          open={openAddLedgerDialog}
          onClose={handleAddLedgerDialogClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            className: "rounded-xl shadow-lg",
          }}
          TransitionProps={{ timeout: 300 }}
        >
          <Box className="flex justify-between items-center p-4 border-b">
            <Typography variant="h6" className="font-bold text-[#4c257e]">
              Add Transaction
            </Typography>
            <IconButton
              onClick={handleAddLedgerDialogClose}
              disabled={isSubmitting}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent sx={{ p: 4 }}>
            <Box className="space-y-6">
              <Typography variant="body1" className="text-gray-600 pb-4">
                Enter transaction details below.
              </Typography>

              {/* Form Fields */}
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount Field */}
                <TextField
                  fullWidth
                  label="Amount"
                  variant="outlined"
                  type="number"
                  value={ledgerFormData.amount}
                  onChange={(e) =>
                    handleLedgerFormChange("amount", e.target.value)
                  }
                  error={!!ledgerFormErrors.amount}
                  helperText={ledgerFormErrors.amount}
                  placeholder="Enter amount..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="text-gray-400">$</span>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "12px",
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#4c257e",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4c257e",
                        },
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                  disabled={isSubmitting}
                />

                {/* Transaction Type Field */}
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!ledgerFormErrors.transactionType}
                >
                  <Select
                    value={ledgerFormData.transactionType}
                    onChange={(e) =>
                      handleLedgerFormChange("transactionType", e.target.value)
                    }
                    displayEmpty
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#4c257e",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4c257e",
                        },
                      },
                    }}
                    disabled={isSubmitting}
                  >
                    <MenuItem value="" disabled>
                      Select transaction type
                    </MenuItem>
                    <MenuItem
                      value="CREDIT"
                      sx={{ fontWeight: 600, color: "#43a047" }}
                    >
                      CREDIT
                    </MenuItem>
                    <MenuItem
                      value="DEBIT"
                      sx={{ fontWeight: 600, color: "#e53935" }}
                    >
                      DEBIT
                    </MenuItem>
                  </Select>
                  {ledgerFormErrors.transactionType && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, ml: 2 }}
                    >
                      {ledgerFormErrors.transactionType}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              {/* Description Field - Full Width */}
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={1}
                value={ledgerFormData.description}
                onChange={(e) =>
                  handleLedgerFormChange("description", e.target.value)
                }
                error={!!ledgerFormErrors.description}
                helperText={ledgerFormErrors.description}
                placeholder="Enter transaction description..."
                InputProps={{
                  sx: {
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#4c257e",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4c257e",
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                  },
                  marginBottom: "16px",
                }}
                disabled={isSubmitting}
              />

              {/* Note Field - Full Width */}
              <TextField
                fullWidth
                label="Note"
                variant="outlined"
                multiline
                rows={3}
                value={ledgerFormData.note}
                onChange={(e) => handleLedgerFormChange("note", e.target.value)}
                error={!!ledgerFormErrors.note}
                helperText={ledgerFormErrors.note}
                placeholder="Enter transaction note..."
                InputProps={{
                  sx: {
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#4c257e",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4c257e",
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f8fafc",
                  },
                }}
                disabled={isSubmitting}
              />

              {/* Client Info Display */}
              <Box className="bg-gray-50 p-3 mt-3 rounded-lg">
                <Typography variant="body2" className="text-gray-600 mb-1">
                  <strong>Selected Client:</strong>{" "}
                  {dropdownClients[selectedClient] || "Please select a client"}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <Box className="flex justify-end gap-3 p-4 border-t bg-gray-50">
            <Button
              variant="outlined"
              onClick={handleAddLedgerDialogClose}
              disabled={isSubmitting}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderColor: "#d1d5db",
                color: "#6b7280",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddLedgerSubmit}
              disabled={isSubmitting}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                backgroundColor: "#4c257e",
                "&:hover": {
                  backgroundColor: "#3730a3",
                },
                "&:disabled": {
                  backgroundColor: "#9ca3af",
                },
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                  Adding Transaction...
                </>
              ) : (
                "Add Transaction"
              )}
            </Button>
          </Box>
        </Dialog>
      </div>
    </div>
  );
};

export default LedgerTracker;
