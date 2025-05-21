import React, { useState, useEffect, useCallback } from 'react';
import { getCustomers, saveCustomer, updateCustomer, deleteCustomer } from '../services/api/customerService';
import Table from './common/Table';
import Modal from './common/Modal';
import Pagination from './common/Pagination';

const ITEMS_PER_PAGE = 10;

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    password: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCustomers(currentPage - 1, ITEMS_PER_PAGE);
      setCustomers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err.message);
      setCustomers([]);
      setTotalPages(0);
      setTotalElements(0);
    }
    setIsLoading(false);
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (currentCustomer) {
        await updateCustomer(currentCustomer.id, formData, profilePhoto);
        await fetchCustomers();
        closeModal();
      } else {
        await saveCustomer(formData, profilePhoto);
        await fetchCustomers();
        closeModal();
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = useCallback((customer = null) => {
    if (customer) {
      setCurrentCustomer(customer);
      setFormData({ 
        name: customer.name, 
        address: customer.address, 
        city: customer.city,
        password: ''
      });
      setPreviewUrl(customer.profilePhotoUrl);
      setProfilePhoto(null);
    } else {
      setCurrentCustomer(null);
      setFormData({ name: '', address: '', city: '', password: '' });
      setPreviewUrl(null);
      setProfilePhoto(null);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
    setPreviewUrl(null);
    setProfilePhoto(null);
  }, []);

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setIsLoading(true);

      try {
        await deleteCustomer(customerId);
        await fetchCustomers();
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { 
      header: 'Photo', 
      field: 'profilePhotoUrl',
      render: (customer) => (
        customer.profilePhotoUrl ? (
          <img 
            src={customer.profilePhotoUrl} 
            alt={`${customer.name}'s photo`} 
            loading="lazy"
            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'12px', color: '#6c757d' }}>
            No Photo
          </div>
        )
      )
    },
    { header: 'Name', field: 'name' },
    { header: 'Address', field: 'address' },
    { header: 'City', field: 'city' }
  ];

  return (
    <div className="container mt-4">
      <h2>Customers</h2>
      <button onClick={() => openModal()} className="btn btn-primary mb-3">Add Customer</button>

      <Table
        columns={columns}
        data={customers}
        isLoading={isLoading}
        emptyMessage="No customers found."
        onEdit={openModal}
        onDelete={handleDelete}
        additionalActions={(customer) => (
          customer.profilePhotoUrl && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => {
                fetch(customer.profilePhotoUrl)
                  .then(response => response.blob())
                  .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${customer.name.toLowerCase().replace(/\s+/g, '-')}-photo.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  })
                  .catch(error => console.error('Error downloading image:', error));
              }}
              title="Download Photo"
            >
              <i className="bi bi-download"></i> Download Photo
            </button>
          )
        )}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentCustomer ? 'Edit Customer' : 'Add Customer'}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isLoading}>Cancel</button>
            <button type="submit" form="customerForm" className="btn btn-primary" disabled={isLoading}>
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
        <form id="customerForm" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          {!currentCustomer && (
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="profilePhoto" className="form-label">Profile Photo</label>
            <input
              type="file"
              className="form-control"
              id="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Customers; 