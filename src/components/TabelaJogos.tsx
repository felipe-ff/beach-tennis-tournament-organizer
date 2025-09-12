import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentStructures, getAvailablePlayerCounts } from '../data/tournamentData';
import './TabelaJogos.css';

const TabelaJogos: React.FC = () => {
  const navigate = useNavigate();
  const availablePlayerCounts = getAvailablePlayerCounts();

  const handleGoBack = () => {
    navigate('/');
  };

  const formatTeam = (playerNumbers: number[]): string => {
    return playerNumbers.join(' e ');
  };

  return (
    <div className="tabela-jogos">
      <div className="header-section">
        <button onClick={handleGoBack} className="back-button">
          ← Voltar
        </button>
        <h1>Tabela de Todos os Jogos Possíveis</h1>
        <p className="explanation">
          Esta é a estrutura fixa de jogos para cada quantidade de jogadores. 
          <strong> O sorteio apenas define qual número cada jogador recebe</strong>, 
          mas os confrontos seguem sempre este padrão predefinido.
        </p>
        
        <div className="mixed-doubles-info">
          <p className="info-note">
            💡 <strong>Para Duplas Mistas:</strong> Cada dupla será automaticamente formada por 1 homem + 1 mulher.
            A primeira metade dos números são homens, a segunda metade são mulheres.
          </p>
        </div>
        <div className="mixed-doubles-info">
          <p className="info-note">
            <strong>Para Duplas Mistas:</strong> Os jogadores 1 a N/2 são homens, e N/2+1 a N são mulheres. 
            Cada dupla será composta automaticamente por 1 homem + 1 mulher.
          </p>
        </div>
      </div>

      {availablePlayerCounts.map((playerCount) => {
        const structure = tournamentStructures[playerCount];
        if (!structure) return null;

        // Flatten all games from all rounds
        const allGames = structure.rounds.flat();

        return (
          <div key={playerCount} className="tournament-section">
            <h2>Torneio com {playerCount} Jogadores ({allGames.length} jogos)</h2>
            <div className="games-grid">
              {allGames.map((gameTemplate) => (
                <div key={gameTemplate.game} className="game-card">
                  <div className="game-number">Jogo {gameTemplate.game}</div>
                  <div className="game-teams">
                    <span className="team">{formatTeam(gameTemplate.team1)}</span>
                    <span className="vs">vs</span>
                    <span className="team">{formatTeam(gameTemplate.team2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="footer-section">
        <div className="transparency-note">
          <h3>🛡️ Transparência Total</h3>
          <p>
            Como você pode ver, <strong>todas as combinações são predefinidas</strong>. 
            Isso garante que não há como manipular ou favorecer qualquer jogador. 
            O único elemento aleatório é o número sorteado por cada participante.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabelaJogos;
