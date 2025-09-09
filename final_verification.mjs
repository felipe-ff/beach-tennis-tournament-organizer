// Verificação final das estruturas restantes
import { getAvailablePlayerCounts, getTournamentStructure } from './src/data/tournamentData.js';

function verifyAllStructures() {
  console.log("=== VERIFICAÇÃO FINAL DAS ESTRUTURAS VÁLIDAS ===\n");
  
  const playerCounts = getAvailablePlayerCounts();
  console.log(`Números de jogadores disponíveis: ${playerCounts.join(', ')}\n`);
  
  playerCounts.forEach(count => {
    console.log(`=== ${count} JOGADORES ===`);
    const structure = getTournamentStructure(count);
    
    if (!structure) {
      console.log(`❌ Estrutura não encontrada!\n`);
      return;
    }
    
    const gamesPerRound = count / 4;
    console.log(`Jogos por rodada: ${gamesPerRound}`);
    
    // Verificar se todos jogam exatamente 1 vez por rodada
    let allValid = true;
    const playerGames = {};
    for (let i = 1; i <= count; i++) {
      playerGames[i] = [0, 0, 0, 0];
    }
    
    structure.rounds.forEach((round, roundIndex) => {
      const playersInRound = {};
      for (let i = 1; i <= count; i++) {
        playersInRound[i] = 0;
      }
      
      round.forEach(game => {
        [...game.team1, ...game.team2].forEach(player => {
          playersInRound[player]++;
          playerGames[player][roundIndex]++;
        });
      });
      
      // Verificar se alguém joga mais de uma vez
      for (let player = 1; player <= count; player++) {
        if (playersInRound[player] !== 1) {
          allValid = false;
          console.log(`❌ Rodada ${roundIndex + 1}: Jogador ${player} joga ${playersInRound[player]} vezes`);
        }
      }
    });
    
    // Verificar total de jogos por jogador
    for (let player = 1; player <= count; player++) {
      const total = playerGames[player].reduce((a, b) => a + b, 0);
      if (total !== 4) {
        allValid = false;
        console.log(`❌ Jogador ${player}: Total de ${total} jogos (deveria ser 4)`);
      }
    }
    
    console.log(`Status: ${allValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}\n`);
  });
}

verifyAllStructures();
