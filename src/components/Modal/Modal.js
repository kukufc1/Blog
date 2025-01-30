// Modal.js
import React from 'react';
import './Modal.css'; // Ensure to style your modal accordingly

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // If not open, return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div>
          <h2>Are you sure to delete this article?</h2>
        </div>
        <div id="modal-content_btn">
          <button onClick={onClose}>No</button>
          <button onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
