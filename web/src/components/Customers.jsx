import React, { useState, useEffect, useCallback } from 'react';
import { getCustomers, saveCustomer, updateCustomer, deleteCustomer } from '../services/api';

const ITEMS_PER_PAGE = 10; // Or any other number you prefer

function Customers() {
  const [allCustomers, setAllCustomers] = useState([]); // Stores all fetched customers
  const [displayedCustomers, setDisplayedCustomers] = useState([]); // Customers for the current page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: ''
  });

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      const fetchedCustomers = data.content || [];
      setAllCustomers(fetchedCustomers);
      setTotalPages(Math.ceil(fetchedCustomers.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError(err.message);
      setAllCustomers([]);
      setTotalPages(0);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Update displayed customers when allCustomers or currentPage changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedCustomers(allCustomers.slice(startIndex, endIndex));
  }, [allCustomers, currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentCustomer) {
        await updateCustomer(currentCustomer.id, formData);
      } else {
        await saveCustomer(formData);
      }
      fetchCustomers(); // Re-fetch all customers to update list and pagination
      closeModal();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const openModal = (customer = null) => {
    if (customer) {
      setCurrentCustomer(customer);
      setFormData({ name: customer.name, address: customer.address, city: customer.city });
    } else {
      setCurrentCustomer(null);
      setFormData({ name: '', address: '', city: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
    setError(null);
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setIsLoading(true);
      try {
        await deleteCustomer(customerId);
        fetchCustomers(); // Re-fetch
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    }
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
      <h2>Customers</h2>
      <button onClick={() => openModal()} className="btn btn-primary mb-3">Add Customer</button>
      {isLoading && (
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}
      
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
              zIndex: 1040, // Bootstrap modal backdrop z-index
            }}
            onClick={closeModal} // Optional: close modal on backdrop click
          ></div>
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block', zIndex: 1050 }} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{currentCustomer ? 'Edit Customer' : 'Add Customer'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name:</label>
                      <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address:</label>
                      <input type="text" id="address" name="address" className="form-control" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="city" className="form-label">City:</label>
                      <input type="text" id="city" name="city" className="form-control" value={formData.city} onChange={handleInputChange} required />
                    </div>
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

      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedCustomers.length === 0 && !isLoading && (
            <tr><td colSpan="6" className="text-center">No customers found.</td></tr>
          )}
          {displayedCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                {customer.profilePhotoUrl ? (
                  <img 
                    src={customer.profilePhotoUrl} 
                    alt={`${customer.name}'s photo`} 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'12px', color: '#6c757d' }}>
                    No Photo
                  </div>
                )}
              </td>
              <td>{customer.name}</td>
              <td>{customer.address}</td>
              <td>{customer.city}</td>
              <td>
                <button onClick={() => openModal(customer)} className="btn btn-sm btn-outline-secondary me-2">Edit</button>
                <button onClick={() => handleDelete(customer.id)} className="btn btn-sm btn-outline-danger" disabled={isLoading}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
}

export default Customers; 