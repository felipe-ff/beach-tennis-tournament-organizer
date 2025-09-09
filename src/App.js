import React, { useState, useEffect } from 'react';
import PlayerSetup from './components/PlayerSetup';
import GamesList from './components/GamesList';
import PlayerStats from './components/PlayerStats';
import { getTournamentStructure } from './data/tournamentData';
import { assignPlayersToNumbers, createTournamentState, updateGameScore } from './utils/tournamentUtils';
import { 
  saveTournament, 
  loadTournament, 
  updateTournament,
  generateTournamentId,
  getCurrentTournamentId,
  setCurrentTournamentId,
  saveToLocalStorage,
  loadFromLocalStorage
} from './services/tournamentService';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('setup');
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentTournamentId, setCurrentTournamentIdState] = useState(null);

  // Load tournament on app start
  useEffect(() => {
    const loadExistingTournament = async () => {
      try {
        const tournamentId = getCurrentTournamentId();
        
        if (tournamentId) {
          setCurrentTournamentIdState(tournamentId);
          
          // Try to load from Firestore first
          try {
            const data = await loadTournament(tournamentId);
            if (data) {
              setTournamentData(data);
              setCurrentView('games');
              console.log('Tournament loaded from Firestore');
            } else {
              // Try localStorage as backup
              const localData = loadFromLocalStorage(tournamentId);
              if (localData) {
                setTournamentData(localData);
                setCurrentView('games');
                console.log('Tournament loaded from localStorage');
              }
            }
          } catch (error) {
            console.error('Error loading from Firestore, trying localStorage:', error);
            // Try localStorage as backup
            const localData = loadFromLocalStorage(tournamentId);
            if (localData) {
              setTournamentData(localData);
              setCurrentView('games');
              console.log('Tournament loaded from localStorage (Firestore failed)');
            }
          }
        }
      } catch (error) {
        console.error('Error loading tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingTournament();
  }, []);

  // Auto-save tournament data when it changes
  useEffect(() => {
    if (tournamentData && currentTournamentId && !loading) {
      const saveData = async () => {
        setSaving(true);
        try {
          // Save to Firestore using the simplified update function
          await updateTournament(currentTournamentId, tournamentData);
          
          // Also save to localStorage as backup
          saveToLocalStorage(currentTournamentId, tournamentData);
          
          console.log('Tournament auto-saved');
        } catch (error) {
          console.error('Error auto-saving tournament:', error);
          // At least save to localStorage if Firestore fails
          saveToLocalStorage(currentTournamentId, tournamentData);
        } finally {
          setSaving(false);
        }
      };

      // Debounce auto-save
      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [tournamentData, currentTournamentId, loading]);

  const handleTournamentCreate = async (playerCount, players) => {
    try {
      setSaving(true);
      
      const structure = getTournamentStructure(playerCount);
      const playerAssignment = assignPlayersToNumbers(players);
      const games = createTournamentState(structure, playerAssignment);
      
      const newTournamentData = {
        playerCount,
        players,
        playerAssignment,
        games,
        structure,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Generate new tournament ID
      const tournamentId = generateTournamentId();
      
      // Save to Firestore
      try {
        await saveTournament(tournamentId, newTournamentData);
        console.log('Tournament created and saved to Firestore');
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
      
      // Always save to localStorage as backup
      saveToLocalStorage(tournamentId, newTournamentData);
      
      // Set current tournament
      setCurrentTournamentId(tournamentId);
      setCurrentTournamentIdState(tournamentId);
      
      setTournamentData(newTournamentData);
      setCurrentView('games');
      
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Erro ao criar torneio. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleScoreUpdate = (gameId, newScore) => {
    setTournamentData(prev => ({
      ...prev,
      games: updateGameScore(prev.games, gameId, newScore)
    }));
  };

  const handleResetTournament = () => {
    setTournamentData(null);
    setCurrentView('setup');
    setCurrentTournamentIdState(null);
    localStorage.removeItem('currentTournamentId');
    
    // Clear URL parameter
    const url = new URL(window.location);
    url.searchParams.delete('tournament');
    window.history.replaceState({}, '', url);
  };

  const renderNavigation = () => {
    if (!tournamentData) return null;
    
    return (
      <nav className="app-navigation">
        <div className="nav-brand">
          <h1>Beach Tennis Tournament</h1>
          {saving && <span className="saving-indicator">Salvando...</span>}
        </div>
        <div className="nav-menu">
          <button
            className={currentView === 'games' ? 'active' : ''}
            onClick={() => setCurrentView('games')}
          >
            Jogos
          </button>
          <button
            className={currentView === 'stats' ? 'active' : ''}
            onClick={() => setCurrentView('stats')}
          >
            Estatísticas
          </button>
          <button
            className="reset-button"
            onClick={handleResetTournament}
          >
            Novo Torneio
          </button>
        </div>
      </nav>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando torneio...</p>
        </div>
      );
    }

    if (!tournamentData) {
      return <PlayerSetup onTournamentCreate={handleTournamentCreate} />;
    }

    switch (currentView) {
      case 'games':
        return (
          <GamesList
            games={tournamentData.games}
            onScoreUpdate={handleScoreUpdate}
          />
        );
      case 'stats':
        return (
          <PlayerStats
            games={tournamentData.games}
            playerAssignment={tournamentData.playerAssignment}
          />
        );
      default:
        return <PlayerSetup onTournamentCreate={handleTournamentCreate} />;
    }
  };

  return (
    <div className="App">
      {renderNavigation()}
      <main className="app-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
