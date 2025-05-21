import httpClient from './httpClient';

export const getDeposits = async (page = 0, size = 20, sortBy = "id", sortDir = "desc") => {
  const { data } = await httpClient.get('/deposits', {
    params: { page, size, sortBy, sortDir }
  });
  return data;
};

export const transferFunds = async (transferData) => {
  const { data } = await httpClient.post('/deposits/transfer', transferData);
  return data;
};

export const downloadTransactionsPdf = async (page = 0, size = 1000, sortBy = "id", sortDir = "asc") => {
  const response = await httpClient.get('/reports/transactions/pdf', {
    params: { page, size, sortBy, sortDir },
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
  });
  return response.data;
}; 