import httpClient from './httpClient';

export const getCustomers = async (page = 0, size = 10, sortBy = "id", sortDir = "asc") => {
  const { data } = await httpClient.get('/customers', {
    params: { page, size, sortBy, sortDir }
  });
  return data;
};

export const saveCustomer = async (customerData, profilePhoto = null) => {
  const formData = new FormData();
  formData.append('customer', new Blob([JSON.stringify(customerData)], {
    type: 'application/json'
  }));
  
  if (profilePhoto) {
    formData.append('profilePhoto', profilePhoto);
  }

  const { data } = await httpClient.post('/customers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const updateCustomer = async (customerId, customerData, profilePhoto = null) => {
  const formData = new FormData();
  formData.append('customer', new Blob([JSON.stringify(customerData)], {
    type: 'application/json'
  }));
  
  if (profilePhoto) {
    formData.append('profilePhoto', profilePhoto);
  }

  const { data } = await httpClient.put(`/customers/${customerId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteCustomer = async (customerId) => {
  const { data } = await httpClient.delete(`/customers/${customerId}`);
  return data;
}; 