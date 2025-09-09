import React, { useState } from 'react';
import { getAvailablePlayerCounts } from '../data/tournamentData';
import './PlayerSetup.css';

const PlayerSetup = ({ onTournamentCreate }) => {
  const [playerCount, setPlayerCount] = useState('');
  const [players, setPlayers] = useState([]);
  const [currentPlayerName, setCurrentPlayerName] = useState('');

  const availableCounts = getAvailablePlayerCounts();

  const handlePlayerCountChange = (count) => {
    setPlayerCount(count);
    setPlayers(new Array(parseInt(count)).fill('').map((_, index) => `Jogador ${index + 1}`));
  };

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = name || `Jogador ${index + 1}`;
    setPlayers(newPlayers);
  };

  const handleCreateTournament = () => {
    if (playerCount && players.length === parseInt(playerCount)) {
      onTournamentCreate(parseInt(playerCount), players);
    }
  };

  const handleAddPlayer = () => {
    if (currentPlayerName.trim() && players.length < parseInt(playerCount)) {
      const newPlayers = [...players];
      newPlayers[players.findIndex(p => p.startsWith('Jogador'))] = currentPlayerName.trim();
      setPlayers(newPlayers);
      setCurrentPlayerName('');
    }
  };

  return (
    <div className="player-setup">
      <h1>Organizador de Torneio de Beach Tennis</h1>
      
      <div className="setup-section">
        <h2>Número de Jogadores</h2>
        <div className="player-count-buttons">
          {availableCounts.map(count => (
            <button
              key={count}
              className={`count-button ${playerCount === count.toString() ? 'selected' : ''}`}
              onClick={() => handlePlayerCountChange(count.toString())}
            >
              {count} jogadores
            </button>
          ))}
        </div>
      </div>

      {playerCount && (
        <div className="setup-section">
          <h2>Nomes dos Jogadores</h2>
          <p className="info-text">
            Você pode deixar os nomes padrão ou personalizar cada jogador.
            Os jogadores serão distribuídos aleatoriamente nos jogos.
          </p>
          
          <div className="player-input-section">
            <div className="quick-add">
              <input
                type="text"
                value={currentPlayerName}
                onChange={(e) => setCurrentPlayerName(e.target.value)}
                placeholder="Digite o nome do jogador"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
              />
              <button onClick={handleAddPlayer} disabled={!currentPlayerName.trim()}>
                Adicionar
              </button>
            </div>
          </div>

          <div className="players-list">
            {players.map((player, index) => (
              <div key={index} className="player-item">
                <span className="player-number">{index + 1}.</span>
                <input
                  type="text"
                  value={player}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Jogador ${index + 1}`}
                  className="player-name-input"
                />
              </div>
            ))}
          </div>

          <div className="create-tournament-section">
            <button
              className="create-tournament-button"
              onClick={handleCreateTournament}
              disabled={!playerCount || players.length !== parseInt(playerCount)}
            >
              Criar Torneio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSetup;
