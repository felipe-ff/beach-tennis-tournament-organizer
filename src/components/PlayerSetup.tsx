import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAvailablePlayerCounts } from "../data/tournamentData";
import {
  assignPlayersToNumbers,
  assignPlayersToNumbersLinear,
  assignPlayersToNumbersMixed,
} from "../utils/tournamentUtils";
import {
  getTournamentsByDate,
  generateTournamentId,
} from "../services/tournamentService";
import "./PlayerSetup.css";

interface PlayerSetupProps {
  onTournamentCreate: (
    tournamentName: string,
    password: string,
    playerCount: number,
    players: string[],
    isLinear: boolean,
    isMixed: boolean
  ) => void;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ onTournamentCreate }) => {
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentPassword, setTournamentPassword] = useState("");
  const [playerCount, setPlayerCount] = useState("12");
  const [players, setPlayers] = useState(
    new Array(12).fill("").map((_, index) => `Jogador ${index + 1}`)
  );
  const [isMixed, setIsMixed] = useState(false);
  const isLinearBracket = true; // Always use linear bracket since the option is commented out
  const [todayTournaments, setTodayTournaments] = useState<
    { name: string; id: string }[]
  >([]);
  const [selectedTournament, setSelectedTournament] = useState<string | null>(
    null
  );
  const [passwordInput, setPasswordInput] = useState("");

  const availableCounts = getAvailablePlayerCounts();

  const handlePlayerCountChange = (count: string) => {
    const newCount = parseInt(count);
    setPlayerCount(count);

    if (isMixed) {
      // For mixed doubles, first half are men (1 to halfCount), second half are women (halfCount+1 to newCount)
      const halfCount = newCount / 2;
      const newPlayers = Array.from({ length: newCount }, (_, index) => {
        if (index < halfCount) {
          return `Homem ${index + 1}`;
        } else {
          return `Mulher ${index + 1}`;
        }
      });
      setPlayers(newPlayers);
    } else {
      // Regular tournament
      setPlayers(
        new Array(newCount).fill("").map((_, index) => `Jogador ${index + 1}`)
      );
    }
  };

  const handleMixedToggle = (mixed: boolean) => {
    setIsMixed(mixed);
    const currentCount = parseInt(playerCount);

    if (mixed) {
      // Switch to mixed mode - men get numbers 1 to halfCount, women get numbers (halfCount+1) to currentCount
      const halfCount = currentCount / 2;
      const newPlayers = Array.from({ length: currentCount }, (_, index) => {
        if (index < halfCount) {
          return `Homem ${index + 1}`;
        } else {
          return `Mulher ${index + 1}`;
        }
      });
      setPlayers(newPlayers);
    } else {
      // Switch to regular mode
      setPlayers(
        new Array(currentCount)
          .fill("")
          .map((_, index) => `Jogador ${index + 1}`)
      );
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name || `Jogador ${index + 1}`;
    setPlayers(newPlayers);
  };

  const handleAccessTournament = async () => {
    if (!selectedTournament || !passwordInput.trim()) {
      alert("Por favor, selecione um torneio e digite a senha.");
      return;
    }

    try {
      // Find the selected tournament from the list
      const tournament = todayTournaments.find(
        (t) => t.id === selectedTournament
      );
      if (!tournament) {
        alert("Torneio não encontrado.");
        return;
      }

      // For now, we'll check if the tournament exists and navigate to it
      // In a real implementation, you would verify the password against the database
      if (passwordInput.trim()) {
        // Set the current tournament ID and navigate
        window.location.href = `/jogos?tournament=${selectedTournament}`;
      } else {
        alert("Senha incorreta.");
      }
    } catch (error) {
      console.error("Error accessing tournament:", error);
      alert("Erro ao acessar o torneio.");
    }

    setPasswordInput("");
    setSelectedTournament(null);
  };

  const handleCreateTournament = () => {
    if (
      tournamentName.trim() &&
      tournamentPassword.trim() &&
      playerCount &&
      players.length === parseInt(playerCount)
    ) {
      onTournamentCreate(
        tournamentName.trim(),
        tournamentPassword.trim(),
        parseInt(playerCount),
        players.slice(0, parseInt(playerCount)),
        isLinearBracket,
        isMixed
      );

      // Refresh the tournament list after creation
      loadTodayTournaments();
    }
  };

  const loadTodayTournaments = async () => {
    try {
      const today = new Date();
      const tournaments = await getTournamentsByDate(today);
      setTodayTournaments(tournaments);
    } catch (error) {
      console.error("Error loading tournaments:", error);
      setTodayTournaments([]);
    }
  };

  // Load tournaments when component mounts
  React.useEffect(() => {
    loadTodayTournaments();
  }, []);

  return (
    <div className="player-setup">
      <h1>Organizador de Torneio de Beach Tennis</h1>

      {todayTournaments.length > 0 && (
        <div className="setup-section">
          <h2>Torneios de Hoje</h2>
          <div className="today-tournaments">
            {todayTournaments.map((tournament, index) => (
              <div
                key={index}
                className={`tournament-item ${
                  selectedTournament === tournament.id ? "selected" : ""
                }`}
                onClick={() => setSelectedTournament(tournament.id)}
              >
                {typeof tournament === "string" ? tournament : tournament.name}
              </div>
            ))}
          </div>

          {selectedTournament && (
            <div className="tournament-access">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a senha do torneio"
                className="tournament-name-input"
              />
              <button
                onClick={handleAccessTournament}
                className="access-tournament-btn"
              >
                Acessar Torneio
              </button>
            </div>
          )}
        </div>
      )}

      <div className="setup-section">
        <h2>Criar um novo Torneio</h2>
        <div className="tournament-info-group">
          <div className="input-group">
            <label>Nome do Torneio</label>
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="Digite o nome do torneio (obrigatório)"
              className="tournament-name-input"
              required
            />
            {!tournamentName.trim() && (
              <p className="error-text">O nome do torneio é obrigatório</p>
            )}
          </div>

          <div className="input-group">
            <label>Senha do Torneio</label>
            <input
              type="password"
              value={tournamentPassword}
              onChange={(e) => setTournamentPassword(e.target.value)}
              placeholder="Digite a senha do torneio (obrigatório)"
              className="tournament-name-input"
              required
            />
            {!tournamentPassword.trim() && (
              <p className="error-text">A senha do torneio é obrigatória</p>
            )}
          </div>
        </div>

        <div className="doubles-type-selector">
          <label className="doubles-option">
            <input
              type="radio"
              name="doublesType"
              checked={!isMixed}
              onChange={() => handleMixedToggle(false)}
            />
            <span className="radio-custom"></span>
            <div className="option-content">
              <strong>Duplas Normais</strong>
              <p>Qualquer combinação de jogadores</p>
            </div>
          </label>
          <label className="doubles-option">
            <input
              type="radio"
              name="doublesType"
              checked={isMixed}
              onChange={() => handleMixedToggle(true)}
            />
            <span className="radio-custom"></span>
            <div className="option-content">
              <strong>Duplas Mistas</strong>
              <p>Cada dupla terá 1 homem + 1 mulher</p>
            </div>
          </label>
        </div>
        {isMixed && (
          <div className="mixed-info">
            <p className="info-text">
              <strong>Duplas Mistas:</strong> Cada dupla será formada por 1
              homem + 1 mulher. Os primeiros {Math.floor(parseInt(playerCount) / 2)} jogadores 
              (números 1 a {Math.floor(parseInt(playerCount) / 2)}) são homens, 
              os últimos {Math.floor(parseInt(playerCount) / 2)} jogadores 
              (números {Math.floor(parseInt(playerCount) / 2) + 1} a {playerCount}) são
              mulheres. O sistema fará o pareamento automaticamente.
            </p>
          </div>
        )}

        <p className="info-text">
          A senha será necessária para acessar o torneio posteriormente.
        </p>

        <h2>Número de Jogadores</h2>
        
        <div className="players-config-group">
          <div className="player-count-section">
            <div className="player-count-buttons">
              {availableCounts.map((count) => (
                <button
                  key={count}
                  className={`count-button ${
                    playerCount === count.toString() ? "selected" : ""
                  }`}
                  onClick={() => handlePlayerCountChange(count.toString())}
                >
                  {count} jogadores
                </button>
              ))}
            </div>
          </div>

          {playerCount && (
            <div className="player-names-section">
              <h3>Nomes dos Jogadores</h3>
              <p className="info-text">
                Você pode deixar os nomes padrão ou personalizar cada jogador (pode ser feito posteriormente).
              </p>

              <div className="players-list">
                {players.map((player, index) => (
                  <div key={index} className="player-item">
                    <span className="player-number">{index + 1}.</span>
                    <input
                      type="text"
                      value={player}
                      onChange={(e) =>
                        handlePlayerNameChange(index, e.target.value)
                      }
                      placeholder={`Jogador ${index + 1}`}
                      className="player-name-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="create-tournament-section">
            <button
              className="create-tournament-button"
              onClick={handleCreateTournament}
              disabled={
                !tournamentName.trim() ||
                !playerCount ||
                players.length !== parseInt(playerCount)
              }
            >
              Criar Torneio
            </button>
          </div>
        </div>
      </div>

{/*       <div className="setup-section">
        
      </div> */}

      
      <div className="setup-section info-section">
        <h2>ℹ️ Como Funciona o Sorteio</h2>
        <div className="tournament-info">
          <p>
            <strong>As chaves são sempre as mesmas</strong> ({" "}
            <Link to="/tabela-jogos" className="info-link">
              ver tabela de todos os jogos
            </Link>{" "}
            ) - o que muda é o número que cada jogador sorteia nas cartas.
          </p>
          <p className="emphasis-text">
            Portanto, <strong>não é possível manipular as chaves</strong>. O
            sorteio dos jogadores e imutabilidade das chaves garantem a
            transparência e imparcialidade no torneio.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerSetup;
