import React, { useState, useEffect } from 'react';
import './GameModal.css';

const GameModal = ({ game, onClose, onScoreSubmit }) => {
  const [team1Score, setTeam1Score] = useState(game.score.team1);
  const [team2Score, setTeam2Score] = useState(game.score.team2);

  useEffect(() => {
    setTeam1Score(game.score.team1);
    setTeam2Score(game.score.team2);
  }, [game]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const score = {
      team1: parseInt(team1Score) || 0,
      team2: parseInt(team2Score) || 0
    };
    onScoreSubmit(game.id, score);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatTeam = (team) => {
    return team.map(player => player.name).join(' + ');
  };

  const increaseScore = (team, currentScore) => {
    if (team === 'team1') {
      setTeam1Score(Math.max(0, currentScore + 1));
    } else {
      setTeam2Score(Math.max(0, currentScore + 1));
    }
  };

  const decreaseScore = (team, currentScore) => {
    if (team === 'team1') {
      setTeam1Score(Math.max(0, currentScore - 1));
    } else {
      setTeam2Score(Math.max(0, currentScore - 1));
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
                    onClick={() => decreaseScore('team1', team1Score)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                    min="0"
                    className="score-input"
                  />
                  <button
                    type="button"
                    className="score-button increase"
                    onClick={() => increaseScore('team1', team1Score)}
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
                    onClick={() => decreaseScore('team2', team2Score)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                    min="0"
                    className="score-input"
                  />
                  <button
                    type="button"
                    className="score-button increase"
                    onClick={() => increaseScore('team2', team2Score)}
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
