import httpClient from './httpClient';

export const getAccounts = async (page = 0, size = 20, sortBy = "id", sortDir = "asc") => {
  const { data } = await httpClient.get('/accounts', {
    params: { page, size, sortBy, sortDir }
  });
  return data;
};

export const saveAccount = async (accountData) => {
  const { data } = await httpClient.post('/accounts', accountData);
  return data;
};

export const updateAccount = async (accountId, accountData) => {
  const { data } = await httpClient.put(`/accounts/${accountId}`, accountData);
  return data;
};

export const deleteAccount = async (accountId) => {
  const { data } = await httpClient.delete(`/accounts/${accountId}`);
  return data;
};

export const linkAccount = async (accountId, customerId) => {
  const { data } = await httpClient.post(`/accounts/${accountId}/link/${customerId}`);
  return data;
};

export const unlinkAccount = async (accountId, customerId) => {
  const { data } = await httpClient.delete(`/accounts/${accountId}/unlink/${customerId}`);
  return data;
}; 