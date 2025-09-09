import React, { useState } from 'react';
import { calculatePlayerStats } from '../utils/tournamentUtils';
import './PlayerStats.css';

const PlayerStats = ({ games, playerAssignment }) => {
  const [sortBy, setSortBy] = useState('pointsScored');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const stats = calculatePlayerStats(games, playerAssignment);
  const playersStats = Object.values(stats);

  const sortedStats = [...playersStats].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getPositionClass = (index) => {
    if (index === 0) return 'position-gold';
    if (index === 1) return 'position-silver';
    if (index === 2) return 'position-bronze';
    return '';
  };

  const getWinPercentageColor = (percentage) => {
    if (percentage >= 75) return '#27ae60';
    if (percentage >= 50) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="player-stats">
      <div className="stats-header">
        <h2>Estatísticas dos Jogadores</h2>
        <div className="stats-summary">
          <div className="summary-card">
            <strong>{playersStats.length}</strong>
            <span>Jogadores</span>
          </div>
          <div className="summary-card">
            <strong>{games.filter(g => g.completed).length}</strong>
            <span>Jogos Finalizados</span>
          </div>
          <div className="summary-card">
            <strong>{Math.round(playersStats.reduce((sum, p) => sum + p.pointsScored, 0) / playersStats.length)}</strong>
            <span>Média de Pontos</span>
          </div>
        </div>
      </div>

      <div className="stats-table-container">
        <table className="stats-table">
          <thead>
            <tr>
              <th className="position-column">#</th>
              <th 
                className="sortable"
                onClick={() => handleSort('name')}
              >
                Jogador {getSortIcon('name')}
              </th>
              <th 
                className="sortable numeric"
                onClick={() => handleSort('gamesPlayed')}
              >
                Jogos {getSortIcon('gamesPlayed')}
              </th>
              <th 
                className="sortable numeric"
                onClick={() => handleSort('pointsScored')}
              >
                Pontos Feitos {getSortIcon('pointsScored')}
              </th>
              <th 
                className="sortable numeric"
                onClick={() => handleSort('gamesWon')}
              >
                Vitórias {getSortIcon('gamesWon')}
              </th>
              <th 
                className="sortable numeric"
                onClick={() => handleSort('gamesDrawn')}
              >
                Empates {getSortIcon('gamesDrawn')}
              </th>
              <th 
                className="sortable numeric"
                onClick={() => handleSort('gamesLost')}
              >
                Derrotas {getSortIcon('gamesLost')}
              </th>
              <th 
                className="sortable numeric"
                onClick={() => handleSort('winPercentage')}
              >
                % Vitórias {getSortIcon('winPercentage')}
              </th>
              <th 
                className="sortable numeric"
                onClick={() => handleSort('pointsAgainst')}
              >
                Pontos Sofridos {getSortIcon('pointsAgainst')}
              </th>
              <th 
                className="sortable numeric"
                onClick={() => handleSort('pointsDifference')}
              >
                Saldo {getSortIcon('pointsDifference')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((player, index) => (
              <tr key={player.name} className={getPositionClass(index)}>
                <td className="position-column">
                  <span className="position-number">{index + 1}</span>
                  {index < 3 && (
                    <span className="medal">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  )}
                </td>
                <td className="player-name">{player.name}</td>
                <td className="numeric">{player.gamesPlayed}</td>
                <td className="numeric points-scored">{player.pointsScored}</td>
                <td className="numeric wins">{player.gamesWon}</td>
                <td className="numeric draws">{player.gamesDrawn}</td>
                <td className="numeric losses">{player.gamesLost}</td>
                <td className="numeric">
                  <span 
                    className="win-percentage"
                    style={{ color: getWinPercentageColor(player.winPercentage) }}
                  >
                    {player.winPercentage}%
                  </span>
                </td>
                <td className="numeric points-against">{player.pointsAgainst}</td>
                <td className={`numeric ${player.pointsDifference >= 0 ? 'positive' : 'negative'}`}>
                  {player.pointsDifference > 0 ? '+' : ''}{player.pointsDifference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {playersStats.length === 0 && (
        <div className="no-stats">
          <p>Nenhuma estatística disponível ainda.</p>
          <p>Complete alguns jogos para ver as estatísticas dos jogadores.</p>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
