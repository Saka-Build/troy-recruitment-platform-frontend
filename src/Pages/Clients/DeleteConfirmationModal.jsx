import React from "react";
import "./DeleteConfirmationModal.css";

function DeleteConfirmationModal({ clientName, onConfirm, onCancel }) {
    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal">
                <div className="delete-modal-header">
                    <h2>Delete Client</h2>
                    <button className="delete-modal-close-btn" onClick={onCancel}>
                        ×
                    </button>
                </div>

                <div className="delete-modal-body">
                    <div className="delete-icon-wrapper">
                        <svg className="delete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    
                    <h3>Are you sure you want to delete this client?</h3>
                    <p>
                        You are about to delete <strong>"{clientName}"</strong>. 
                        This action cannot be undone.
                    </p>
                </div>

                <div className="delete-modal-footer">
                    <button className="delete-cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="delete-confirm-btn" onClick={onConfirm}>
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;