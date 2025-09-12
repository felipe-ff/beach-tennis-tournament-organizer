import React, { useState, useEffect } from 'react';
import { Game } from '../types/tournament';
import './GameModal.css';

interface GameModalProps {
  game: Game;
  onClose: () => void;
  onScoreSubmit: (gameId: number, score: { team1: number; team2: number }) => void;
}

const GameModal: React.FC<GameModalProps> = ({ game, onClose, onScoreSubmit }) => {
  const [team1Score, setTeam1Score] = useState<string>(game.score.team1.toString());
  const [team2Score, setTeam2Score] = useState<string>(game.score.team2.toString());

  useEffect(() => {
    setTeam1Score(game.score.team1.toString());
    setTeam2Score(game.score.team2.toString());
  }, [game]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = {
      team1: parseInt(team1Score) || 0,
      team2: parseInt(team2Score) || 0
    };
    onScoreSubmit(game.id, score);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatTeam = (team: { number: number; name: string }[]) => {
    return team.map(player => {
      // Check if it's a default name (Jogador X, Homem X, Mulher X)
      const defaultNames = [`Jogador ${player.number}`, `Homem ${player.number}`, `Mulher ${player.number}`];
      const isDefaultName = defaultNames.includes(player.name);
      
      // Only show number if it's NOT a default name
      return isDefaultName ? player.name : `${player.name} (${player.number})`;
    }).join(' + ');
  };

  const increaseScore = (team: 'team1' | 'team2', currentScore: number) => {
    if (team === 'team1') {
      setTeam1Score((Math.max(0, currentScore + 1)).toString());
    } else {
      setTeam2Score((Math.max(0, currentScore + 1)).toString());
    }
  };

  const decreaseScore = (team: 'team1' | 'team2', currentScore: number) => {
    if (team === 'team1') {
      setTeam1Score((Math.max(0, currentScore - 1)).toString());
    } else {
      setTeam2Score((Math.max(0, currentScore - 1)).toString());
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Jogo {game.id} - Rodada {game.round}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="teams-score">
              <div className="team-score-section">
                <div className="team-info">
                  <h4>Time 1</h4>
                  <p className="team-players">{formatTeam(game.team1)}</p>
                </div>
                <div className="score-controls">
                  <button
                    type="button"
                    className="score-button decrease"
                    onClick={() => decreaseScore('team1', parseInt(team1Score) || 0)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    min="0"
                    className="score-input"
                  />
                  <button
                    type="button"
                    className="score-button increase"
                    onClick={() => increaseScore('team1', parseInt(team1Score) || 0)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="vs-divider">
                <span>VS</span>
              </div>

              <div className="team-score-section">
                <div className="team-info">
                  <h4>Time 2</h4>
                  <p className="team-players">{formatTeam(game.team2)}</p>
                </div>
                <div className="score-controls">
                  <button
                    type="button"
                    className="score-button decrease"
                    onClick={() => decreaseScore('team2', parseInt(team2Score) || 0)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    min="0"
                    className="score-input"
                  />
                  <button
                    type="button"
                    className="score-button increase"
                    onClick={() => increaseScore('team2', parseInt(team2Score) || 0)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="save-button">
                Salvar Placar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
