import React, { useState } from 'react';
import { getGamesByRound } from '../utils/tournamentUtils';
import GameModal from './GameModal';
import './GamesList.css';

const GamesList = ({ games, onScoreUpdate }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedRound, setSelectedRound] = useState(1);
  
  const gamesByRound = getGamesByRound(games);
  const rounds = Object.keys(gamesByRound).map(Number).sort();

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  const handleScoreSubmit = (gameId, score) => {
    onScoreUpdate(gameId, score);
    setSelectedGame(null);
  };

  const getGameStatusClass = (game) => {
    if (game.completed) {
      return 'game-completed';
    }
    return 'game-pending';
  };

  const formatTeam = (team) => {
    return team.map(player => player.name).join(' + ');
  };

  const getGameScore = (game) => {
    if (game.completed) {
      return `${game.score.team1} - ${game.score.team2}`;
    }
    return 'Pendente';
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
        {gamesByRound[selectedRound]?.map(game => (
          <div
            key={game.id}
            className={`game-card ${getGameStatusClass(game)}`}
            onClick={() => handleGameClick(game)}
          >
            <div className="game-header">
              <span className="game-number">Jogo {game.id}</span>
              <span className={`game-status ${game.completed ? 'completed' : 'pending'}`}>
                {game.completed ? 'Finalizado' : 'Pendente'}
              </span>
            </div>
            
            <div className="game-matchup">
              <div className="team team1">
                <span className="team-name">{formatTeam(game.team1)}</span>
              </div>
              
              <div className="vs-section">
                <span className="vs">VS</span>
                <span className="score">{getGameScore(game)}</span>
              </div>
              
              <div className="team team2">
                <span className="team-name">{formatTeam(game.team2)}</span>
              </div>
            </div>
          </div>
        ))}
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
