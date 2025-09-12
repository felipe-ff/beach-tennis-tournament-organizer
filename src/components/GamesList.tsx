import React, { useState } from 'react';
import { getGamesByRound } from '../utils/tournamentUtils';
import GameModal from './GameModal';
import { Game } from '../types/tournament';
import './GamesList.css';

interface GamesListProps {
  games: Game[];
  onScoreUpdate: (gameId: number, score: { team1: number; team2: number }) => void;
  isAdmin?: boolean;
}

const GamesList: React.FC<GamesListProps> = ({ games, onScoreUpdate, isAdmin = false }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedRound, setSelectedRound] = useState(1);
  
  const gamesByRound: Record<number, Game[]> = getGamesByRound(games);
  const rounds = Object.keys(gamesByRound).map(Number).sort();

  // Check if a game can have its score edited
  const canEditGame = (game: Game): boolean => {
    // Admin can always edit
    if (isAdmin) return true;
    
    // Non-admin can only edit if score is still 0-0 (not set yet)
    return game.score.team1 === 0 && game.score.team2 === 0;
  };

  const handleGameClick = (game: Game) => {
    if (canEditGame(game)) {
      setSelectedGame(game);
    } else {
      // Show a message or do nothing for locked games
      console.log('Game score is locked. Admin access required to edit.');
    }
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  const handleScoreSubmit = (gameId: number, score: { team1: number; team2: number }) => {
    onScoreUpdate(gameId, score);
    setSelectedGame(null);
  };

  const getGameStatusClass = (game: Game) => {
    if (game.completed) {
      return 'game-completed';
    }
    return 'game-pending';
  };

  const formatTeam = (team: { number: number; name: string; gender?: 'M' | 'F' }[]) => {
    return team.map(player => {
      const genderIcon = player.gender === 'M' ? '♂️' : player.gender === 'F' ? '♀️' : '';
      
      // Check if it's a default name (Jogador X, Homem X, Mulher X)
      const defaultNames = [`Jogador ${player.number}`, `Homem ${player.number}`, `Mulher ${player.number}`];
      const isDefaultName = defaultNames.includes(player.name);
      
      // Only show number if it's NOT a default name
      const playerWithNumber = isDefaultName ? player.name : `${player.name} (${player.number})`;
      return genderIcon ? `${genderIcon} ${playerWithNumber}` : playerWithNumber;
    }).join(' + ');
  };

  const getGameScore = (game: Game) => {
    if (game.completed) {
      return `${game.score.team1} - ${game.score.team2}`;
    }
    return 'Atribuir Placar';
  };

  return (
    <div className="games-list">
      <div className="games-header">
        <h2>Jogos do Torneio</h2>
        <div className="round-selector">
          {rounds.map(round => (
            <button
              key={round}
              className={`round-button ${selectedRound === round ? 'active' : ''}`}
              onClick={() => setSelectedRound(round)}
            >
              Rodada {round}
            </button>
          ))}
        </div>
      </div>

      <div className="games-grid">
        {gamesByRound[selectedRound]?.map(game => {
          const canEdit = canEditGame(game);
          return (
            <div
              key={game.id}
              className={`game-card ${getGameStatusClass(game)}`}
              onClick={() => handleGameClick(game)}
              style={{ cursor: canEdit ? 'pointer' : 'not-allowed' }}
            >
              <div className="game-header">
                <span className="game-number">
                  Jogo {game.id}
                </span>
                <span className={`game-status ${game.completed ? 'completed' : 'pending'}`}>
                  {game.completed ? 'Finalizado' : 'Pendente'}
                </span>
              </div>
              
              <div className="game-matchup">
                <div className="teams-row">
                  <div className="team team1">
                    <span className="team-name">{formatTeam(game.team1)}</span>
                  </div>
                  
                  <div className="vs-divider">VS</div>
                  
                  <div className="team team2">
                    <span className="team-name">{formatTeam(game.team2)}</span>
                  </div>
                </div>
                
                <div className="score-row">
                  <span className="score">{getGameScore(game)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="games-summary">
        <div className="summary-item">
          <strong>Total de Jogos:</strong> {games.length}
        </div>
        <div className="summary-item">
          <strong>Jogos Finalizados:</strong> {games.filter(g => g.completed).length}
        </div>
        <div className="summary-item">
          <strong>Jogos Pendentes:</strong> {games.filter(g => !g.completed).length}
        </div>
      </div>

      {selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={handleCloseModal}
          onScoreSubmit={handleScoreSubmit}
        />
      )}
    </div>
  );
};

export default GamesList;
