import React, { useState } from 'react';
import { calculatePlayerStats } from '../utils/tournamentUtils';
import { Game, PlayerStats as PlayerStatsType } from '../types/tournament';
import './PlayerStats.css';

interface PlayerStatsProps {
  games: Game[];
  playerAssignment: Record<number, string>;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ games, playerAssignment }) => {
  const [sortBy, setSortBy] = useState<keyof PlayerStatsType>('pointsScored');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const stats = calculatePlayerStats(games, playerAssignment);
  const playersStats: PlayerStatsType[] = Object.values(stats);

  // Primeiro ordena por pontos (decrescente) para pegar os 8 melhores
  const topPlayers = [...playersStats]
    .sort((a, b) => b.pointsScored - a.pointsScored)
    .slice(0, 8);

  // Depois ordena pelos critérios selecionados pelo usuário
  const sortedStats = [...topPlayers].sort((a: PlayerStatsType, b: PlayerStatsType) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: keyof PlayerStatsType) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: keyof PlayerStatsType) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getPositionClass = (index: number) => {
    if (index === 0) return 'position-gold';
    if (index === 1) return 'position-silver';
    if (index === 2) return 'position-bronze';
    return '';
  };

  return (
    <div className="player-stats">
      <div className="stats-header">
        <h2>Classificados - Top 8</h2>
        <div className="stats-summary">
          <div className="summary-card">
            <strong>{sortedStats.length}</strong>
            <span>Classificados</span>
          </div>
          <div className="summary-card">
            <strong>{games.filter(g => g.completed).length}</strong>
            <span>Jogos Finalizados</span>
          </div>
          <div className="summary-card">
            <strong>{Math.round(topPlayers.reduce((sum: number, p: PlayerStatsType) => sum + p.pointsScored, 0) / topPlayers.length)}</strong>
            <span>Média de Pontos (Top 8)</span>
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
                onClick={() => handleSort('pointsDifference')}
              >
                Saldo {getSortIcon('pointsDifference')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((player: PlayerStatsType, index: number) => (
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
