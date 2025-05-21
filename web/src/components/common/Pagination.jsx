import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isZeroBased = false
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const adjustedCurrentPage = isZeroBased ? currentPage + 1 : currentPage;

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={`page-item ${adjustedCurrentPage === 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(adjustedCurrentPage - 1)} 
            disabled={adjustedCurrentPage === 1}
          >
            Previous
          </button>
        </li>
        {pageNumbers.map(number => (
          <li 
            key={number} 
            className={`page-item ${adjustedCurrentPage === number ? 'active' : ''}`}
          >
            <button 
              className="page-link" 
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item ${adjustedCurrentPage === totalPages ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(adjustedCurrentPage + 1)} 
            disabled={adjustedCurrentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default React.memo(Pagination); 