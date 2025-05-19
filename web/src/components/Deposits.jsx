import React, { useState, useEffect, useCallback } from 'react';
import { getDeposits, transferFunds, getAccounts, downloadTransactionsPdf } from '../services/api';
import ContinueButton from './ContinueButton';

const ITEMS_PER_PAGE = 10; // Or any other number you prefer

function Deposits() {
  const [allDeposits, setAllDeposits] = useState([]); // Stores all fetched deposits
  const [displayedDeposits, setDisplayedDeposits] = useState([]); // Deposits for the current page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: ''
  });
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const fetchDeposits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDeposits();
      const fetchedDeposits = data.content || [];
      setAllDeposits(fetchedDeposits);
      setTotalPages(Math.ceil(fetchedDeposits.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err.message);
      setAllDeposits([]);
      setTotalPages(0);
    }
    setIsLoading(false);
  }, []);

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

  // Update displayed deposits when allDeposits or currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedDeposits(allDeposits.slice(startIndex, endIndex));
  }, [allDeposits, currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTransfer = async (e) => {
    e.preventDefault();
    if (formData.fromAccountId === formData.toAccountId) {
        setError("Cannot transfer to the same account.");
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
      fetchDeposits(); // Re-fetch all deposits to update list and pagination
      closeModal();
    } catch (err) {
      setError(err.message);
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
      const blob = await downloadTransactionsPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "transaction_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
    setIsDownloadingPdf(false);
  };

  const getAccountDisplayName = (accountId, accountsList) => {
    if (accountId === undefined || accountId === null) return 'N/A';
    const account = accountsList.find(acc => acc.id === accountId);
    if (account && account.customers && account.customers.length > 0 && account.customers[0].name) {
      return `${account.customers[0].name}`;
    } else if (account) {
      // Fallback if customer name isn't available but account is found
      return `Account (Branch: ${account.branch})`;
    }
    return `Account (Unknown)`; // Fallback if account not found in the fetched list
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
          </li>
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(number)}>
                {number}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Deposits History</h2>
      <button onClick={openModal} className="btn btn-primary" style={{ padding: '13px' }}>New Transfer</button>
      <div onClick={isLoading || isDownloadingPdf ? undefined : handleDownloadPdf} style={{ display: 'inline-block', cursor: isLoading || isDownloadingPdf ? 'not-allowed' : 'pointer' }} className="mb-3 ms-2">
        <ContinueButton />
      </div>
      {isLoading && (
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger mt-3" role="alert">Error: {error}</div>}

      {isModalOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040,
            }}
            onClick={closeModal}
          ></div>
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block', zIndex: 1050 }} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">New Fund Transfer</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {/* Display general errors or specific transfer errors here if needed */}
                  {error && <div className="alert alert-danger" role="alert">{error}</div>}
                  <form onSubmit={handleSubmitTransfer}>
                    <div className="mb-3">
                      <label htmlFor="fromAccountId" className="form-label">From Account:</label>
                      <select id="fromAccountId" name="fromAccountId" className="form-select" value={formData.fromAccountId} onChange={handleInputChange} required>
                        <option value="">-- Select Account --</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.customers && acc.customers.length > 0 ? acc.customers[0].name : `Account`} (Branch: {acc.branch}, Bal: {acc.balance.toFixed(2)})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="toAccountId" className="form-label">To Account:</label>
                      <select id="toAccountId" name="toAccountId" className="form-select" value={formData.toAccountId} onChange={handleInputChange} required>
                        <option value="">-- Select Account --</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.customers && acc.customers.length > 0 ? acc.customers[0].name : `Account`} (Branch: {acc.branch}, Bal: {acc.balance.toFixed(2)})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="amount" className="form-label">Amount:</label>
                      <input type="number" id="amount" name="amount" className="form-control" value={formData.amount} onChange={handleInputChange} required min="0.01" step="0.01" />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isLoading}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : 'Transfer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>From Account</th>
            <th>To Account</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {displayedDeposits.length === 0 && !isLoading && (
            <tr><td colSpan="6" className="text-center">No deposit history found.</td></tr>
          )}
          {displayedDeposits.map(deposit => (
            <tr key={deposit.id}>
              <td>{deposit.id}</td>
              <td>{getAccountDisplayName(deposit.fromAccountId, accounts)}</td>
              <td>{getAccountDisplayName(deposit.toAccountId, accounts)}</td>
              <td>{typeof deposit.amount === 'number' ? deposit.amount.toFixed(2) : 'N/A'}</td>
              <td>{deposit.date ? new Date(deposit.date).toLocaleString() : 'N/A'}</td>
              <td>{deposit.transactionType || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
}

export default Deposits; 