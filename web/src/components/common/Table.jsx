import React from 'react';

const Table = ({ 
  columns, 
  data, 
  isLoading, 
  emptyMessage = "No data found.",
  onEdit,
  onDelete,
  additionalActions,
  renderRowActions
}) => {
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.header}</th>
          ))}
          {(onEdit || onDelete || additionalActions || renderRowActions) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && !isLoading && (
          <tr><td colSpan={columns.length + 1} className="text-center">{emptyMessage}</td></tr>
        )}
        {data.map((item, rowIndex) => (
          <tr key={item.id || rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>
                {column.render ? column.render(item) : item[column.field]}
              </td>
            ))}
            {(onEdit || onDelete || additionalActions || renderRowActions) && (
              <td>
                {onEdit && (
                  <button 
                    onClick={() => onEdit(item)} 
                    className="btn btn-sm btn-outline-secondary me-2"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button 
                    onClick={() => onDelete(item.id)} 
                    className="btn btn-sm btn-outline-danger me-2"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                )}
                {additionalActions && additionalActions(item)}
                {renderRowActions && renderRowActions(item)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(Table); 