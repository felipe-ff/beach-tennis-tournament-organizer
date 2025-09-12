import React, { useState, useEffect } from 'react';
import './PlayerNamesPopup.css';

interface PlayerNamesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  players: string[];
  onUpdatePlayerNames: (newNames: string[]) => void;
  lockedPlayers: boolean[]; // Track which players have already been named
}

const PlayerNamesPopup: React.FC<PlayerNamesPopupProps> = ({
  isOpen,
  onClose,
  players,
  onUpdatePlayerNames,
  lockedPlayers
}) => {
  const [editedNames, setEditedNames] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditedNames([...players]);
      setHasChanges(false);
    }
  }, [isOpen, players]);

  const handleNameChange = (index: number, newName: string) => {
    if (lockedPlayers[index]) return; // Don't allow changes to locked players
    
    const updated = [...editedNames];
    updated[index] = newName;
    setEditedNames(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdatePlayerNames(editedNames);
    setHasChanges(false);
    onClose();
  };

  const handleCancel = () => {
    setEditedNames([...players]);
    setHasChanges(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content player-names-popup">
        <div className="popup-header">
          <h3>Editar Nomes dos Jogadores</h3>
          <button className="close-button" onClick={handleCancel}>×</button>
        </div>
        
        <div className="popup-body">
          <p className="popup-description">
            ⚠️ <strong>Atenção:</strong> Uma vez que um nome for definido, ele não poderá ser alterado novamente.
          </p>
          
          <div className="players-grid">
            {editedNames.map((name, index) => (
              <div key={index} className="player-input-group">
                <label htmlFor={`player-${index}`}>
                  Jogador {index + 1}:
                </label>
                <input
                  id={`player-${index}`}
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  disabled={lockedPlayers[index]}
                  className={lockedPlayers[index] ? 'locked' : ''}
                  placeholder={`Jogador ${index + 1}`}
                />
                {lockedPlayers[index] && (
                  <span className="lock-icon" title="Nome já definido - não pode ser alterado">
                    🔒
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="popup-footer">
          <button 
            className="cancel-button" 
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button 
            className="save-button" 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Salvar Nomes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerNamesPopup;
