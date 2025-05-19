import React, { useState, useEffect, useCallback } from 'react';
import {
  getAccounts,
  saveAccount,
  updateAccount,
  deleteAccount,
  linkAccount,
  unlinkAccount,
  getCustomers // To select customer for linking
} from '../services/api';

const ITEMS_PER_PAGE = 10; // Or any other number you prefer

function Accounts() {
  const [allAccounts, setAllAccounts] = useState([]); // Stores all fetched accounts
  const [displayedAccounts, setDisplayedAccounts] = useState([]); // Accounts for the current page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [customers, setCustomers] = useState([]); // For linking
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isViewCustomersModalOpen, setIsViewCustomersModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [accountForViewCustomersModal, setAccountForViewCustomersModal] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [formData, setFormData] = useState({
    branch: '',
    balance: '',
    customerId: '' // For creating an account initially linked to a customer
  });

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAccounts();
      const fetchedAccounts = data.content || [];
      setAllAccounts(fetchedAccounts);
      setTotalPages(Math.ceil(fetchedAccounts.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err.message);
      setAllAccounts([]); // Clear accounts on error
      setTotalPages(0);
    }
    setIsLoading(false);
  }, []);

  const fetchCustomersForLink = useCallback(async () => {
    try {
      const data = await getCustomers(); // Fetch all customers for dropdown
      setCustomers(data.content || []);
    } catch (err) {
      // Handle error fetching customers, maybe log it or show a small non-blocking notification
      console.error("Failed to fetch customers for linking:", err);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchCustomersForLink();
  }, [fetchAccounts, fetchCustomersForLink]);

  // Update displayed accounts when allAccounts or currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedAccounts(allAccounts.slice(startIndex, endIndex));
  }, [allAccounts, currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload = { ...formData, balance: parseFloat(formData.balance) };
      if (currentAccount) {
        await updateAccount(currentAccount.id, payload);
      } else {
        // Ensure customerId is a number if provided
        if (payload.customerId) {
            payload.customerId = parseInt(payload.customerId, 10);
        }
        await saveAccount(payload);
      }
      fetchAccounts();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const openModal = (account = null) => {
    if (account) {
      setCurrentAccount(account);
      setFormData({ branch: account.branch, balance: account.balance, customerId: account.customer ? account.customer.id : '' });
    } else {
      setCurrentAccount(null);
      setFormData({ branch: '', balance: '', customerId: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
    setError(null);
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setIsLoading(true);
      try {
        await deleteAccount(accountId);
        fetchAccounts();
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    }
  };

  const openLinkModal = (account) => {
    setCurrentAccount(account);
    setSelectedCustomerId('');
    setIsLinkModalOpen(true);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentAccount(null);
    setSelectedCustomerId('');
    setError(null);
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError("Please select a customer to link.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await linkAccount(currentAccount.id, selectedCustomerId);
      fetchAccounts(); // Refresh to show updated links
      closeLinkModal();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };
  
  const handleUnlink = async (accountId, customerId) => {
    if (window.confirm('Are you sure you want to unlink this customer from the account?')) {
        setIsLoading(true);
        setError(null);
        try {
            await unlinkAccount(accountId, customerId);
            fetchAccounts(); // Refresh the main accounts list
            // If the view customers modal is open for this account, update or close it
            if (isViewCustomersModalOpen && accountForViewCustomersModal && accountForViewCustomersModal.id === accountId) {
              // Option 1: Close the modal
              // closeViewCustomersModal(); 
              // Option 2: Refresh its content (requires accountForViewCustomersModal to be updated)
              // For simplicity, we might close it or rely on the main list refresh if the user reopens.
              // Let's try to refresh the data for the modal if it is open.
              const updatedAccountData = await getAccounts(); // This fetches all, ideally we fetch one account
              const targetAccount = updatedAccountData.content.find(acc => acc.id === accountId);
              if (targetAccount) {
                setAccountForViewCustomersModal(targetAccount);
              } else {
                closeViewCustomersModal(); // If account somehow not found, close modal
              }
            }
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }
  };

  const openViewCustomersModal = (account) => {
    setAccountForViewCustomersModal(account);
    setIsViewCustomersModalOpen(true);
  };

  const closeViewCustomersModal = () => {
    setIsViewCustomersModalOpen(false);
    setAccountForViewCustomersModal(null);
    setError(null); // Clear any errors specific to this modal if needed
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Render Pagination Component Logic (can be extracted to a separate component later)
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
      <h2>Accounts</h2>
      <button onClick={() => openModal()} className="btn btn-primary mb-3">Add Account</button>
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
                  <h5 className="modal-title">{currentAccount ? 'Edit Account' : 'Add Account'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="branch" className="form-label">Branch:</label>
                      <input type="text" id="branch" name="branch" className="form-control" value={formData.branch} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="balance" className="form-label">Balance:</label>
                      <input type="number" id="balance" name="balance" className="form-control" value={formData.balance} onChange={handleInputChange} required />
                    </div>
                    {!currentAccount && (
                      <div className="mb-3">
                        <label htmlFor="customerId" className="form-label">Customer (Optional, for initial link):</label>
                        <select id="customerId" name="customerId" className="form-select" value={formData.customerId} onChange={handleInputChange}>
                          <option value="">Select Customer</option>
                          {customers.map(c => <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>)}
                        </select>
                      </div>
                    )}
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isLoading}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isLinkModalOpen && currentAccount && (
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
            onClick={closeLinkModal}
          ></div>
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block', zIndex: 1050 }} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Link Customer to Account ID: {currentAccount.id}</h5>
                  <button type="button" className="btn-close" onClick={closeLinkModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger" role="alert">{error}</div>}
                  <form onSubmit={handleLinkSubmit}>
                    <div className="mb-3">
                      <label htmlFor="linkCustomerId" className="form-label">Select Customer:</label>
                      <select id="linkCustomerId" className="form-select" value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} required>
                        <option value="">-- Select Customer --</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>{customer.name} (ID: {customer.id})</option>
                        ))}
                      </select>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeLinkModal} disabled={isLoading}>Cancel</button>
                      <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading && currentAccount.id === formData.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Linking...
                          </>
                        ) : 'Link Customer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isViewCustomersModalOpen && accountForViewCustomersModal && (
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
            onClick={closeViewCustomersModal}
          ></div>
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block', zIndex: 1050 }} role="dialog" id="viewCustomersModal">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Linked Customers for Account #{accountForViewCustomersModal.id} (Branch: {accountForViewCustomersModal.branch})</h5>
                  <button type="button" className="btn-close" onClick={closeViewCustomersModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {accountForViewCustomersModal.customers && accountForViewCustomersModal.customers.length > 0 ? (
                    <ul className="list-group list-group-flush">
                      {accountForViewCustomersModal.customers.map(cust => (
                        <li key={cust.id} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{cust.name}</strong> (ID: {cust.id})
                          </div>
                          <button 
                            className="btn btn-sm btn-outline-danger unlink-button-modal" 
                            onClick={() => handleUnlink(accountForViewCustomersModal.id, cust.id)}
                            disabled={isLoading}
                            title={`Unlink ${cust.name}`}
                          >
                            Unlink Customer
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-muted">No customers are currently linked to this account.</p>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeViewCustomersModal}>Close</button>
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
            <th>Branch</th>
            <th>Balance</th>
            <th>Linked Customers</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedAccounts.length === 0 && !isLoading && (
            <tr><td colSpan="5" className="text-center">No accounts found.</td></tr>
          )}
          {displayedAccounts.map(account => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.branch}</td>
              <td>{account.balance.toFixed(2)}</td>
              <td>
                {account.customers && account.customers.length > 0 ? (
                  <button 
                    className="btn btn-sm btn-outline-primary view-customers-btn"
                    onClick={() => openViewCustomersModal(account)}
                  >
                    View ({account.customers.length})
                  </button>
                ) : (
                  <span className="text-muted">None</span>
                )}
              </td>
              <td>
                <button onClick={() => openModal(account)} className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                <button onClick={() => handleDelete(account.id)} className="btn btn-sm btn-outline-danger me-2" disabled={isLoading}>Delete</button>
                <button onClick={() => openLinkModal(account)} className="btn btn-sm btn-outline-info">Link Customer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
}

export default Accounts; 