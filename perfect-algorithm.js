// ===== ALGORITMO PERFEITO PARA DUPLAS MISTAS =====

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Algoritmo que garante balanceamento perfeito usando backtracking
function createPerfectMixedTournament(playerCount) {
  console.log(`=== ALGORITMO PERFEITO - ${playerCount} JOGADORES ===`);
  
  const halfCount = playerCount / 2;
  const men = Array.from({ length: halfCount }, (_, i) => i + 1);
  const women = Array.from({ length: halfCount }, (_, i) => halfCount + i + 1);
  
  const gamesPerRound = playerCount / 4;
  const totalRounds = 4;
  const expectedGamesPerPlayer = (gamesPerRound * totalRounds * 4) / playerCount;
  
  console.log(`Esperado: ${expectedGamesPerPlayer} jogos por jogador`);
  
  // Gera todas as combinações possíveis de pares mistos
  const allPairs = [];
  men.forEach(man => {
    women.forEach(woman => {
      allPairs.push([man, woman]);
    });
  });
  
  console.log(`Total de pares possíveis: ${allPairs.length}`);
  
  // Função para verificar se uma configuração é válida
  function isValidConfiguration(games, targetGamesPerPlayer) {
    const playerCount = {};
    
    // Conta jogos por jogador
    games.forEach(game => {
      game.players.forEach(player => {
        playerCount[player] = (playerCount[player] || 0) + 1;
      });
    });
    
    // Verifica se todos têm a quantidade certa de jogos
    for (let i = 1; i <= playerCount; i++) {
      if ((playerCount[i] || 0) !== targetGamesPerPlayer) {
        return false;
      }
    }
    
    return true;
  }
  
  // Backtracking para encontrar solução perfeita
  function findPerfectSolution() {
    const usedPairs = new Set();
    const games = [];
    const playerGameCount = {};
    
    // Inicializa contadores
    for (let i = 1; i <= playerCount; i++) {
      playerGameCount[i] = 0;
    }
    
    function backtrack(round, gameInRound) {
      // Se completou todas as rodadas
      if (round > totalRounds) {
        return isValidConfiguration(games, expectedGamesPerPlayer);
      }
      
      // Se completou a rodada atual, vai para a próxima
      if (gameInRound >= gamesPerRound) {
        return backtrack(round + 1, 0);
      }
      
      // Tenta todas as combinações de 2 pares para este jogo
      for (let i = 0; i < allPairs.length; i++) {
        for (let j = i + 1; j < allPairs.length; j++) {
          const pair1 = allPairs[i];
          const pair2 = allPairs[j];
          
          // Verifica se é um jogo válido
          const players = [...pair1, ...pair2];
          if (new Set(players).size !== 4) continue; // Não pode repetir jogador no mesmo jogo
          
          const pair1Key = `${pair1[0]}-${pair1[1]}`;
          const pair2Key = `${pair2[0]}-${pair2[1]}`;
          
          // Verifica se os pares já foram usados
          if (usedPairs.has(pair1Key) || usedPairs.has(pair2Key)) continue;
          
          // Verifica se algum jogador excederia o limite
          let canUse = true;
          for (const player of players) {
            if (playerGameCount[player] >= expectedGamesPerPlayer) {
              canUse = false;
              break;
            }
          }
          
          if (!canUse) continue;
          
          // Tenta usar este jogo
          usedPairs.add(pair1Key);
          usedPairs.add(pair2Key);
          players.forEach(p => playerGameCount[p]++);
          
          games.push({
            round: round,
            game: gameInRound + 1,
            team1: pair1,
            team2: pair2,
            players: players
          });
          
          // Recursão
          if (backtrack(round, gameInRound + 1)) {
            return true;
          }
          
          // Desfaz a tentativa (backtrack)
          usedPairs.delete(pair1Key);
          usedPairs.delete(pair2Key);
          players.forEach(p => playerGameCount[p]--);
          games.pop();
        }
      }
      
      return false;
    }
    
    if (backtrack(1, 0)) {
      return games;
    }
    
    return null;
  }
  
  console.log("Procurando solução perfeita...");
  const solution = findPerfectSolution();
  
  if (solution) {
    console.log("✅ SOLUÇÃO PERFEITA ENCONTRADA!\n");
    
    // Mostra os jogos
    for (let round = 1; round <= totalRounds; round++) {
      console.log(`RODADA ${round}:`);
      const roundGames = solution.filter(g => g.round === round);
      roundGames.forEach((game, index) => {
        console.log(`  Jogo ${index + 1}: [${game.team1.join(',')}] vs [${game.team2.join(',')}]`);
        
        // Destaca se Mulher 13 está jogando
        if (game.players.includes(13)) {
          console.log(`    ✅ MULHER 13 está jogando!`);
        }
      });
    }
    
    // Verifica o balanceamento
    const playerGameCount = {};
    solution.forEach(game => {
      game.players.forEach(player => {
        playerGameCount[player] = (playerGameCount[player] || 0) + 1;
      });
    });
    
    console.log("\n=== BALANCEAMENTO ===");
    console.log("HOMENS:");
    men.forEach(m => {
      console.log(`  Homem ${m}: ${playerGameCount[m]} jogos`);
    });
    
    console.log("MULHERES:");
    women.forEach(w => {
      console.log(`  Mulher ${w}: ${playerGameCount[w]} jogos`);
    });
    
    const counts = Object.values(playerGameCount);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    
    console.log(`\nMin: ${min}, Max: ${max}, Diferença: ${max - min}`);
    
    // Verifica se Mulher 13 joga na Rodada 3
    const round3Games = solution.filter(g => g.round === 3);
    const mulher13Round3 = round3Games.some(g => g.players.includes(13));
    
    console.log(`\nMulher 13 joga na Rodada 3? ${mulher13Round3 ? 'SIM' : 'NÃO'}`);
    
    if (max - min === 0) {
      console.log("🏆 PERFEITO: Balanceamento absoluto alcançado!");
    }
    
  } else {
    console.log("❌ Não foi possível encontrar solução perfeita com as restrições atuais");
  }
}

// Testa com 20 jogadores
createPerfectMixedTournament(20);
