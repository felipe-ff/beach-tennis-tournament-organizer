import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import PlayerNamesPopup from './PlayerNamesPopup';
import AdminPopup from './AdminPopup';
import { checkAdminStatus } from '../utils/adminUtils';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  tournamentData?: any;
  onNewTournament?: () => void;
  saving?: boolean;
  onUpdatePlayerNames?: (newNames: string[]) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, tournamentData, onNewTournament, saving, onUpdatePlayerNames }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isPlayerNamesPopupOpen, setIsPlayerNamesPopupOpen] = useState(false);
  const [isAdminPopupOpen, setIsAdminPopupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status on component mount and periodically
  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(checkAdminStatus());
    };
    
    checkAdmin();
    
    // Check admin status every minute to handle expiry
    const interval = setInterval(checkAdmin, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Get current tournament ID from URL
  const currentTournamentId = searchParams.get('tournament');

  // Navigate with tournament ID preserved
  const navigateWithTournament = (path: string) => {
    if (currentTournamentId) {
      navigate(`${path}?tournament=${currentTournamentId}`);
    } else {
      navigate(path);
    }
  };

  // Get player names from tournament data
  const getPlayerNames = (): string[] => {
    if (!tournamentData?.playerAssignment) return [];
    const playerCount = Object.keys(tournamentData.playerAssignment).length;
    const names = [];
    for (let i = 1; i <= playerCount; i++) {
      names.push(tournamentData.playerAssignment[i] || `Jogador ${i}`);
    }
    return names;
  };

  // Check which players already have custom names (locked)
  const getLockedPlayers = (): boolean[] => {
    // If user is admin, no players are locked
    if (isAdmin) {
      const playerNames = getPlayerNames();
      return new Array(playerNames.length).fill(false);
    }
    
    const playerNames = getPlayerNames();
    
    return playerNames.map((name, index) => {
      const playerNumber = index + 1;
      const defaultNames = [
        `Jogador ${playerNumber}`,  // Regular tournament default
        `Homem ${playerNumber}`,    // Mixed tournament male default
        `Mulher ${playerNumber}`    // Mixed tournament female default
      ];
      
      // A player is locked if their name is NOT one of the default names
      return !defaultNames.includes(name);
    });
  };

  const handleUpdatePlayerNames = (newNames: string[]) => {
    if (onUpdatePlayerNames) {
      onUpdatePlayerNames(newNames);
    }
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      // If already admin, show option to lock (could be implemented later)
      return;
    } else {
      // Show admin login popup
      setIsAdminPopupOpen(true);
    }
  };

  const handleAdminUnlock = () => {
    setIsAdmin(true);
  };

  const renderNavigation = () => {
    // Não mostrar navegação na página de tabela de jogos
    if (location.pathname === '/tabela-jogos') {
      return null;
    }

    // Não mostrar navegação se não há torneio ativo
    if (!tournamentData) {
      return null;
    }

    return (
      <nav className="app-navigation">
        <div className="nav-content">
          <h2 className="tournament-title">{tournamentData.tournamentName || 'Torneio Beach Tennis'}</h2>
          <div className="nav-buttons">
            <button
              className={`nav-button ${location.pathname === '/jogos' ? 'active' : ''}`}
              onClick={() => navigateWithTournament('/jogos')}
            >
              Jogos
            </button>
            <button
              className={`nav-button ${location.pathname === '/classificacao' ? 'active' : ''}`}
              onClick={() => navigateWithTournament('/classificacao')}
            >
              Classificação
            </button>
            <button
              className="nav-button edit-names"
              onClick={() => setIsPlayerNamesPopupOpen(true)}
            >
              Editar Nomes
            </button>
            <button
              className="nav-button new-tournament"
              onClick={onNewTournament}
            >
              Voltar ao Início
            </button>

             <button
              className="nav-button admin-toggle"
              onClick={handleAdminToggle}
              title={isAdmin ? "Admin: Desbloqueado" : "Acesso Administrativo"}
            >
              {isAdmin ? '🔓' : '🔒'}
            </button>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="app-layout">
      {renderNavigation()}
      <main className="app-content">
        {children}
      </main>
      
      <PlayerNamesPopup
        isOpen={isPlayerNamesPopupOpen}
        onClose={() => setIsPlayerNamesPopupOpen(false)}
        players={getPlayerNames()}
        lockedPlayers={getLockedPlayers()}
        onUpdatePlayerNames={handleUpdatePlayerNames}
      />
      
      <AdminPopup
        isOpen={isAdminPopupOpen}
        onClose={() => setIsAdminPopupOpen(false)}
        onAdminUnlock={handleAdminUnlock}
      />
    </div>
  );
};

export default Layout;
