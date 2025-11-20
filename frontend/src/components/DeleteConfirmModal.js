import React from 'react';

function DeleteConfirmModal({ isOpen, onClose, onConfirm, orderDescription }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Confirm Delete</h3>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '0.5rem', color: '#4b5563' }}>
            Are you sure you want to delete this order?
          </p>
          {orderDescription && (
            <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '4px' }}>
              {orderDescription}
            </p>
          )}
          <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '1rem' }}>
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
