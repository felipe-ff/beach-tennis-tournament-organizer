import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import PlayerSetup from './components/PlayerSetup';
import GamesList from './components/GamesList';
import PlayerStats from './components/PlayerStats';
import TabelaJogos from './components/TabelaJogos';
import { getTournamentStructure } from './data/tournamentData';
import { assignPlayersToNumbers, assignPlayersToNumbersLinear, createTournamentState, updateGameScore, assignPlayersToNumbersMixed, createMixedTournamentStructure } from './utils/tournamentUtils';
import { 
  saveTournament, 
  loadTournament, 
  updateTournament,
  generateTournamentId,
  getCurrentTournamentId,
  setCurrentTournamentId
} from './services/tournamentService';
import { TournamentData } from './types/tournament';
import './App.css';

function App() {
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentTournamentId, setCurrentTournamentIdState] = useState<string | null>(null);
  const navigate = useNavigate();

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
              navigate('/jogos');
              console.log('Tournament loaded from Firestore');
            } else {
              console.log('Tournament not found');
            }
          } catch (error) {
            console.error('Error loading tournament:', error);
          }
        }
      } catch (error) {
        console.error('Error loading tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingTournament();
  }, [navigate]);

  // Auto-save tournament data when it changes
  useEffect(() => {
    if (tournamentData && currentTournamentId && !loading) {
      const saveData = async () => {
        setSaving(true);
        try {
          // Save to Firestore using the simplified update function
          await updateTournament(currentTournamentId, tournamentData);
          console.log('Tournament auto-saved');
        } catch (error) {
          console.error('Error auto-saving tournament:', error);
        } finally {
          setSaving(false);
        }
      };

      // Debounce the save operation
      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [tournamentData, currentTournamentId, loading]);

  const handleTournamentCreate = async (tournamentName: string, password: string, playerCount: number, players: string[], isLinear: boolean, isMixed: boolean) => {
    try {
      setSaving(true);
      
      const structure = getTournamentStructure(playerCount);
      const playerAssignment = isMixed 
        ? assignPlayersToNumbersMixed(players)
        : (isLinear 
          ? assignPlayersToNumbersLinear(players)
          : assignPlayersToNumbers(players));
      const games = createTournamentState(structure, playerAssignment, isMixed, playerCount);
      
      const newTournamentData = {
        tournamentName,
        password,
        playerCount,
        players,
        playerAssignment,
        games,
        structure,
        isMixed: isMixed || false, // Ensure it's never undefined
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
        throw error; // Re-throw to handle in UI
      }
      
      // Set current tournament
      setCurrentTournamentId(tournamentId);
      setCurrentTournamentIdState(tournamentId);
      setTournamentData(newTournamentData);
      
      // Navigate to games
      navigate('/jogos');
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleScoreUpdate = async (gameId: number, newScore: { team1: number; team2: number }) => {
    if (!tournamentData || !currentTournamentId) return;

    const updatedGames = updateGameScore(tournamentData.games, gameId, newScore);
    const updatedTournamentData = {
      ...tournamentData,
      games: updatedGames,
      updatedAt: new Date()
    };

    setTournamentData(updatedTournamentData);
  };

  const handleNewTournament = () => {
    // Clear current tournament data
    setTournamentData(null);
    setCurrentTournamentIdState(null);
    setCurrentTournamentId('');
    
    // Navigate to setup
    navigate('/');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando torneio...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout tournamentData={tournamentData} onNewTournament={handleNewTournament}>
      <Routes>
        <Route 
          path="/" 
          element={<PlayerSetup onTournamentCreate={handleTournamentCreate} />} 
        />
        <Route 
          path="/jogos" 
          element={
            tournamentData ? (
              <GamesList
                games={tournamentData.games}
                onScoreUpdate={handleScoreUpdate}
              />
            ) : (
              <PlayerSetup onTournamentCreate={handleTournamentCreate} />
            )
          } 
        />
        <Route 
          path="/classificacao" 
          element={
            tournamentData ? (
              <PlayerStats
                games={tournamentData.games}
                playerAssignment={tournamentData.playerAssignment}
              />
            ) : (
              <PlayerSetup onTournamentCreate={handleTournamentCreate} />
            )
          } 
        />
        <Route path="/tabela-jogos" element={<TabelaJogos />} />
      </Routes>
    </Layout>
  );
}

export default App;
