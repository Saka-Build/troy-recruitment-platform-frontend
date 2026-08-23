import React from "react";
import "./Common.css";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete confirmation",
  itemName = "",
  message,
  deleteText = "Delete",
  cancelText = "Cancel",
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="delete-modal-overlay"
      onMouseDown={onClose}
    >
      <div
        className="delete-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-icon">
          <span>!</span>
        </div>

        <div className="delete-modal-content">
          <h2>{title}</h2>

          {message ? (
            <p>{message}</p>
          ) : (
            <p>
              Are you sure you want to delete
              {itemName ? (
                <>
                  {" "}
                  <strong>{itemName}</strong>
                </>
              ) : null}
              ?
            </p>
          )}

          <span className="delete-modal-warning">
            This action cannot be undone.
          </span>
        </div>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="delete-modal-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="delete-modal-confirm"
            onClick={onConfirm}
          >
            {deleteText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;