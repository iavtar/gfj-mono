# Client Ledger API Documentation

This API provides a basic ledger system for tracking financial transactions per client.

## Base URL
```
/api/client-ledger
```

## Endpoints

### 1. Create Transaction
**POST** `/transaction`

Creates a new ledger transaction for a specific client.

**Request Body:**
```json
{
  "clientId": 1,
  "amount": 1000.00,
  "transactionType": "CREDIT",
  "description": "Payment received for order #123",
  "reference": "ORDER-123",
  "note": "Customer payment"
}
```

**Transaction Types:**
- `CREDIT` - Money received (positive balance)
- `DEBIT` - Money paid/spent (negative balance)

**Response:**
```json
{
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "clientId": 1,
    "transactionId": "TXN-A1B2C3D4",
    "amount": 1000.00,
    "transactionType": "CREDIT",
    "description": "Payment received for order #123",
    "reference": "ORDER-123",
    "note": "Customer payment",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

### 2. Get Client Ledger
**GET** `/client/{clientId}?page=0&size=20`

Retrieves the complete ledger for a specific client with pagination.

**Parameters:**
- `clientId` (path) - The client ID
- `page` (query) - Page number (default: 0)
- `size` (query) - Page size (default: 20, max: 100)

**Response:**
```json
{
  "clientId": 1,
  "clientName": "ABC Jewelers",
  "currentBalance": 2500.00,
  "totalTransactions": 15,
  "recentTransactions": [
    {
      "id": 1,
      "clientId": 1,
      "transactionId": "TXN-A1B2C3D4",
      "amount": 1000.00,
      "transactionType": "CREDIT",
      "description": "Payment received for order #123",
      "reference": "ORDER-123",
      "note": "Customer payment",
      "createdAt": "2024-01-15T10:30:00",
      "updatedAt": "2024-01-15T10:30:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 15,
  "totalPages": 1
}
```

### 3. Get Transaction
**GET** `/transaction/{transactionId}`

Retrieves a specific transaction by its ID.

**Response:**
```json
{
  "message": "Transaction retrieved successfully",
  "data": {
    "id": 1,
    "clientId": 1,
    "transactionId": "TXN-A1B2C3D4",
    "amount": 1000.00,
    "transactionType": "CREDIT",
    "description": "Payment received for order #123",
    "reference": "ORDER-123",
    "note": "Customer payment",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
}
```

### 4. Delete Transaction
**DELETE** `/transaction/{transactionId}`

Deletes a specific transaction.

**Response:**
```json
{
  "message": "Transaction deleted successfully"
}
```

### 5. Get Client Balance
**GET** `/client/{clientId}/balance`

Retrieves the current balance for a specific client.

**Response:**
```json
{
  "message": "Client balance retrieved successfully",
  "data": 2500.00
}
```

## Features

- **Client-wise tracking**: Each transaction is associated with a specific client
- **Balance calculation**: Automatic calculation of current balance (CREDIT - DEBIT)
- **Transaction history**: Complete transaction history with pagination
- **Unique transaction IDs**: Auto-generated unique transaction identifiers
- **Validation**: Input validation for all required fields
- **Error handling**: Comprehensive error handling with meaningful messages

## Database Schema

The system uses a single table `client_ledger` with the following structure:

- `id` - Primary key
- `client_id` - Foreign key to client table
- `transaction_id` - Unique transaction identifier
- `amount` - Transaction amount
- `transaction_type` - CREDIT or DEBIT
- `description` - Transaction description
- `reference` - Optional reference (e.g., order number)
- `note` - Optional additional notes
- `created_at` - Transaction creation timestamp
- `updated_at` - Last update timestamp
