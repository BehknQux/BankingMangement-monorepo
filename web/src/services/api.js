const API_BASE_URL = "http://localhost:8080/api/v1";

// Customer Endpoints
export const getCustomers = async (page = 0, size = 20, sortBy = "id", sortDir = "asc") => {
  const response = await fetch(`${API_BASE_URL}/customers?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  return response.json();
};

export const saveCustomer = async (customerData) => {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) {
    throw new Error("Failed to save customer");
  }
  return response.json();
};

export const updateCustomer = async (customerId, customerData) => {
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customerData),
  });
  if (!response.ok) {
    throw new Error("Failed to update customer");
  }
  return response.json();
};

export const deleteCustomer = async (customerId) => {
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete customer");
  }
  // DELETE typically doesn't return a body, or returns an empty one.
  // If your API returns specific success/failure, adjust accordingly.
  return response.status === 200 || response.status === 204;
};

// Account Endpoints
export const getAccounts = async (page = 0, size = 20, sortBy = "id", sortDir = "asc") => {
  const response = await fetch(`${API_BASE_URL}/accounts?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }
  return response.json();
};

export const saveAccount = async (accountData) => {
  const response = await fetch(`${API_BASE_URL}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountData),
  });
  if (!response.ok) {
    throw new Error("Failed to save account");
  }
  return response.json();
};

export const updateAccount = async (accountId, accountData) => {
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(accountData),
  });
  if (!response.ok) {
    throw new Error("Failed to update account");
  }
  return response.json();
};

export const deleteAccount = async (accountId) => {
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete account");
  }
  return response.status === 200 || response.status === 204;
};

export const linkAccount = async (accountId, customerId) => {
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/link/${customerId}`, {
    method: "POST",
  });
  if (!response.ok) {
    // Attempt to read error message from backend if available
    const errorBody = await response.text();
    try {
        const errorJson = JSON.parse(errorBody);
        throw new Error(errorJson.message || "Failed to link account");
    } catch (e) {
        throw new Error(errorBody || "Failed to link account");
    }
  }
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text(); // Or handle as a success status, e.g., { success: true }
  }
};

export const unlinkAccount = async (accountId, customerId) => {
  const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/unlink/${customerId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to unlink account");
  }
  // Assuming it returns a success status or relevant data
  return response.status === 200 || response.status === 204;
};


// Deposit Endpoints
export const getDeposits = async (page = 0, size = 20, sortBy = "id", sortDir = "desc") => {
  const response = await fetch(`${API_BASE_URL}/deposits?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  if (!response.ok) {
    throw new Error("Failed to fetch deposits");
  }
  return response.json();
};

export const transferFunds = async (transferData) => {
  const response = await fetch(`${API_BASE_URL}/deposits/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transferData),
  });
  if (!response.ok) {
    // Attempt to read error message from backend if available
    const errorBody = await response.text();
    try {
        const errorJson = JSON.parse(errorBody);
        throw new Error(errorJson.message || "Failed to transfer funds");
    } catch (e) {
        throw new Error(errorBody || "Failed to transfer funds");
    }
  }
  return response.json();
};

export const downloadTransactionsPdf = async (page = 0, size = 1000, sortBy = "id", sortDir = "asc") => {
  const response = await fetch(`${API_BASE_URL}/reports/transactions/pdf?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  if (!response.ok) {
    const errorBody = await response.text();
    try {
        const errorJson = JSON.parse(errorBody);
        throw new Error(errorJson.message || "Failed to download PDF report");
    } catch (e) {
        throw new Error(errorBody || "Failed to download PDF report");
    }
  }
  return response.blob(); // Return the response as a Blob
}; 