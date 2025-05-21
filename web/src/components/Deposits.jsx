import React, { useState, useEffect, useCallback } from 'react';
import { getDeposits, transferFunds, downloadTransactionsPdf } from '../services/api/depositService';
import { getAccounts } from '../services/api/accountService';
import ContinueButton from './ContinueButton';
import Table from './common/Table';
import Modal from './common/Modal';
import Pagination from './common/Pagination';
import { CloudCog } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

function Deposits() {
  const [deposits, setDeposits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: ''
  });

  const fetchDeposits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDeposits(currentPage - 1, ITEMS_PER_PAGE);
      setDeposits(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err.message);
      setDeposits([]);
      setTotalPages(0);
    }
    setIsLoading(false);
  }, [currentPage]);

  const fetchAccountsForTransfer = useCallback(async () => {
    try {
      const data = await getAccounts(); 
      setAccounts(data.content || []);
    } catch (err) {
      console.error("Failed to fetch accounts for transfer:", err);
    }
  }, []);

  useEffect(() => {
    fetchDeposits();
    fetchAccountsForTransfer();
  }, [fetchDeposits, fetchAccountsForTransfer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTransfer = async (e) => {
    e.preventDefault();
    if (formData.fromAccountId === formData.toAccountId) {
      console.error("Cannot transfer to the same account.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      await transferFunds(payload);
      fetchDeposits();
      closeModal();
    } catch (err) {
      console.error(err.message);
    }
    setIsLoading(false);
  };

  const openModal = () => {
    setFormData({ fromAccountId: '', toAccountId: '', amount: '' });
    setIsModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setError(null);
    try {
      const pdfBlob = await downloadTransactionsPdf();
      if (!pdfBlob) {
        throw new Error('Invalid PDF data received');
      }
      
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "transaction_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err.message || 'Failed to download PDF');
      setError('Failed to download PDF report. Please try again.');
    }
    setIsDownloadingPdf(false);
  };

  const getAccountDisplayName = (accountId) => {
    if (accountId === undefined || accountId === null) return 'N/A';
    const account = accounts.find(acc => acc.id === accountId);
    if (account && account.customers && account.customers.length > 0 && account.customers[0].name) {
      return `${account.customers[0].name}`;
    } else if (account) {
      return `Account (Branch: ${account.branch})`;
    }
    return `Account (Unknown)`;
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { 
      header: 'From Account', 
      field: 'fromAccountId',
      render: (deposit) => getAccountDisplayName(deposit.fromAccountId)
    },
    { 
      header: 'To Account', 
      field: 'toAccountId',
      render: (deposit) => getAccountDisplayName(deposit.toAccountId)
    },
    { 
      header: 'Amount', 
      field: 'amount',
      render: (deposit) => typeof deposit.amount === 'number' ? deposit.amount.toFixed(2) : 'N/A'
    },
    { 
      header: 'Date', 
      field: 'date',
      render: (deposit) => deposit.date ? new Date(deposit.date).toLocaleString() : 'N/A'
    },
    { header: 'Type', field: 'transactionType' }
  ];

  return (
    <div className="container mt-4">
      <h2>Deposits History</h2>
      <button onClick={openModal} className="btn btn-primary" style={{ padding: '13px' }}>New Transfer</button>
      <div onClick={isLoading || isDownloadingPdf ? undefined : handleDownloadPdf} style={{ display: 'inline-block', cursor: isLoading || isDownloadingPdf ? 'not-allowed' : 'pointer' }} className="mb-3 ms-2">
        <ContinueButton />
      </div>

      <Table
        columns={columns}
        data={deposits}
        isLoading={isLoading}
        emptyMessage="No deposit history found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="New Fund Transfer"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isLoading}>Cancel</button>
            <button type="submit" form="transferForm" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : 'Transfer'}
            </button>
          </>
        }
      >
        <form id="transferForm" onSubmit={handleSubmitTransfer}>
          <div className="mb-3">
            <label htmlFor="fromAccountId" className="form-label">From Account</label>
            <select
              className="form-select"
              id="fromAccountId"
              name="fromAccountId"
              value={formData.fromAccountId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select source account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.customers && account.customers.length > 0 
                    ? `${account.customers[0].name} (Branch: ${account.branch})`
                    : `Account (Branch: ${account.branch})`}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="toAccountId" className="form-label">To Account</label>
            <select
              className="form-select"
              id="toAccountId"
              name="toAccountId"
              value={formData.toAccountId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select destination account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.customers && account.customers.length > 0 
                    ? `${account.customers[0].name} (Branch: ${account.branch})`
                    : `Account (Branch: ${account.branch})`}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0.01"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Deposits; 