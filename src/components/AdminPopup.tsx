import React, { useState } from 'react';
import './AdminPopup.css';

interface AdminPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminUnlock: () => void;
}

const AdminPopup: React.FC<AdminPopupProps> = ({ isOpen, onClose, onAdminUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'kioskbeach@123') {
      // Set admin status in localStorage with 24 hour expiry
      const adminData = {
        isAdmin: true,
        expiryTime: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
      };
      localStorage.setItem('tournamentAdmin', JSON.stringify(adminData));
      
      onAdminUnlock();
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Senha incorreta');
      setPassword('');
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-popup-overlay" onClick={handleOverlayClick}>
      <div className="admin-popup">
        <div className="admin-popup-header">
          <h3>🔒 Acesso Administrativo</h3>
          <button className="close-button" onClick={handleCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label htmlFor="adminPassword">Digite a senha de administrador:</label>
            <input
              type="password"
              id="adminPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha de administrador"
              className="admin-password-input"
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <div className="admin-popup-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="unlock-btn" disabled={!password.trim()}>
              Desbloquear
            </button>
          </div>
        </form>
        
        <div className="admin-info">
          <p>⏱️ O acesso administrativo será válido por 24 horas</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPopup;
