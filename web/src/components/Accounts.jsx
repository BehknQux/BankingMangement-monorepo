import React, { useState, useEffect, useCallback } from 'react';
import {
  getAccounts,
  saveAccount,
  updateAccount,
  deleteAccount,
  linkAccount,
  unlinkAccount
} from '../services/api/accountService';
import { getCustomers } from '../services/api/customerService';
import Table from './common/Table';
import Modal from './common/Modal';
import Pagination from './common/Pagination';

const ITEMS_PER_PAGE = 10;

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isViewCustomersModalOpen, setIsViewCustomersModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [accountForViewCustomersModal, setAccountForViewCustomersModal] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [formData, setFormData] = useState({
    branch: '',
    balance: '',
    customerId: '',
    accountType: 'SAVINGS'
  });

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAccounts(currentPage - 1, ITEMS_PER_PAGE);
      setAccounts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err.message);
      setAccounts([]);
      setTotalPages(0);
      setTotalElements(0);
    }
    setIsLoading(false);
  }, [currentPage]);

  const fetchCustomersForLink = useCallback(async () => {
    try {
      const data = await getCustomers();
      setCustomers(data.content || []);
    } catch (err) {
      console.error("Failed to fetch customers for linking:", err);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchCustomersForLink();
  }, [fetchAccounts, fetchCustomersForLink]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { ...formData, balance: parseFloat(formData.balance) };
      if (currentAccount) {
        await updateAccount(currentAccount.id, payload);
      } else {
        if (payload.customerId) {
          payload.customerId = parseInt(payload.customerId, 10);
        }
        await saveAccount(payload);
      }
      fetchAccounts();
      closeModal();
    } catch (err) {
      console.error(err.message);
    }
    setIsLoading(false);
  };

  const openModal = (account = null) => {
    if (account) {
      setCurrentAccount(account);
      setFormData({
        branch: account.branch,
        balance: account.balance,
        customerId: account.customer ? account.customer.id : '',
        accountType: account.accountType
      });
    } else {
      setCurrentAccount(null);
      setFormData({
        branch: '',
        balance: '',
        customerId: '',
        accountType: 'SAVINGS'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setIsLoading(true);
      try {
        await deleteAccount(accountId);
        fetchAccounts();
      } catch (err) {
        console.error(err.message);
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
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      console.error("Please select a customer to link.");
      return;
    }
    setIsLoading(true);
    try {
      await linkAccount(currentAccount.id, selectedCustomerId);
      fetchAccounts();
      closeLinkModal();
    } catch (err) {
      console.error(err.message);
    }
    setIsLoading(false);
  };
  
  const handleUnlink = async (accountId, customerId) => {
    if (window.confirm('Are you sure you want to unlink this customer from the account?')) {
      setIsLoading(true);
      try {
        await unlinkAccount(accountId, customerId);
        fetchAccounts();
        if (isViewCustomersModalOpen && accountForViewCustomersModal && accountForViewCustomersModal.id === accountId) {
          const updatedAccountData = await getAccounts();
          const targetAccount = updatedAccountData.content.find(acc => acc.id === accountId);
          if (targetAccount) {
            setAccountForViewCustomersModal(targetAccount);
          } else {
            closeViewCustomersModal();
          }
        }
      } catch (err) {
        console.error(err.message);
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
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Branch', field: 'branch' },
    { header: 'Balance', field: 'balance', render: (account) => account.balance.toFixed(2) },
    { 
      header: 'Linked Customers', 
      field: 'customers',
      render: (account) => (
        account.customers && account.customers.length > 0 ? (
          <button 
            className="btn btn-sm btn-outline-primary view-customers-btn"
            onClick={() => openViewCustomersModal(account)}
          >
            View ({account.customers.length})
          </button>
        ) : (
          <span className="text-muted">None</span>
        )
      )
    }
  ];

  const renderRowActions = (account) => (
    <>
      <button onClick={() => openModal(account)} className="btn btn-sm btn-outline-secondary me-2">Edit</button>
      <button onClick={() => handleDelete(account.id)} className="btn btn-sm btn-outline-danger me-2" disabled={isLoading}>Delete</button>
      <button onClick={() => openLinkModal(account)} className="btn btn-sm btn-outline-info">Link Customer</button>
    </>
  );

  return (
    <div className="container mt-4">
      <h2>Accounts</h2>
      <button onClick={() => openModal()} className="btn btn-primary mb-3">Add Account</button>

      <Table
        columns={columns}
        data={accounts}
        isLoading={isLoading}
        emptyMessage="No accounts found."
        renderRowActions={renderRowActions}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentAccount ? 'Edit Account' : 'Add Account'}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isLoading}>Cancel</button>
            <button type="submit" form="accountForm" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : 'Save'}
            </button>
          </>
        }
      >
        <form id="accountForm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="branch" className="form-label">Branch</label>
            <input
              type="text"
              className="form-control"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="balance" className="form-label">Balance</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="balance"
              name="balance"
              value={formData.balance}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="accountType" className="form-label">Account Type</label>
            <select
              className="form-select"
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              required
            >
              <option value="SAVINGS">Savings</option>
              <option value="CHECKING">Checking</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="customerId" className="form-label">Customer</label>
            <select
              className="form-select"
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isLinkModalOpen}
        onClose={closeLinkModal}
        title="Link Customer to Account"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeLinkModal} disabled={isLoading}>Cancel</button>
            <button type="submit" form="linkForm" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Linking...
                </>
              ) : 'Link'}
            </button>
          </>
        }
      >
        <form id="linkForm" onSubmit={handleLinkSubmit}>
          <div className="mb-3">
            <label htmlFor="customerId" className="form-label">Select Customer</label>
            <select
              className="form-select"
              id="customerId"
              name="customerId"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewCustomersModalOpen}
        onClose={closeViewCustomersModal}
        title="Linked Customers"
        size="lg"
      >
        {accountForViewCustomersModal && (
          <div>
            <h6>Account Details:</h6>
            <p>Branch: {accountForViewCustomersModal.branch}</p>
            <p>Balance: {accountForViewCustomersModal.balance.toFixed(2)}</p>
            <hr />
            <h6>Linked Customers:</h6>
            {accountForViewCustomersModal.customers && accountForViewCustomersModal.customers.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accountForViewCustomersModal.customers.map(customer => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.name}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleUnlink(accountForViewCustomersModal.id, customer.id)}
                          disabled={isLoading}
                        >
                          Unlink
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No customers linked to this account.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Accounts; 