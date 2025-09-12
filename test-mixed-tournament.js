// Teste para verificar se as duplas mistas não se repetem - versão final

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function testMixedTournamentFinal() {
  console.log("=== TESTE DE DUPLAS MISTAS - VERSÃO FINAL ===\n");
  
  // Simular a lógica de duplas mistas para 8 jogadores (4 homens + 4 mulheres)
  const playerCount = 8;
  const originalStructure = {
    rounds: [
      // Rodada 1
      [
        { game: 1, team1: [1, 2], team2: [3, 4] },
        { game: 2, team1: [5, 6], team2: [7, 8] }
      ],
      // Rodada 2
      [
        { game: 3, team1: [1, 3], team2: [5, 7] },
        { game: 4, team1: [2, 4], team2: [6, 8] }
      ],
      // Rodada 3
      [
        { game: 5, team1: [1, 5], team2: [2, 6] },
        { game: 6, team1: [3, 7], team2: [4, 8] }
      ]
    ]
  };
  
  const halfCount = playerCount / 2;
  const menNumbers = [1, 2, 3, 4];
  const womenNumbers = [5, 6, 7, 8];
  
  // Shuffle for randomness (keeping predictable for test)
  const shuffledMen = menNumbers;
  const shuffledWomen = womenNumbers;
  
  // Implementar lógica final com rastreamento de pares únicos
  const usedPairs = new Set();
  
  const createUniqueMixedPair = (excludePairs = new Set()) => {
    for (const man of shuffledMen) {
      for (const woman of shuffledWomen) {
        const pairKey = `${Math.min(man, woman)}-${Math.max(man, woman)}`;
        if (!usedPairs.has(pairKey) && !excludePairs.has(pairKey)) {
          return [man, woman];
        }
      }
    }
    return null;
  };
  
  const mixedStructure = {
    rounds: originalStructure.rounds.map((round, roundIndex) => 
      round.map((game) => {
        const gameExcludedPairs = new Set();
        
        // Create team 1
        let team1Pair = createUniqueMixedPair(gameExcludedPairs);
        if (!team1Pair) {
          const baseIndex = (roundIndex * round.length) % halfCount;
          team1Pair = [shuffledMen[baseIndex], shuffledWomen[baseIndex]];
        } else {
          const pairKey = `${Math.min(team1Pair[0], team1Pair[1])}-${Math.max(team1Pair[0], team1Pair[1])}`;
          usedPairs.add(pairKey);
          gameExcludedPairs.add(pairKey);
        }
        
        // Create team 2
        let team2Pair = createUniqueMixedPair(gameExcludedPairs);
        if (!team2Pair) {
          const baseIndex = (roundIndex * round.length + 1) % halfCount;
          team2Pair = [shuffledMen[(baseIndex + 1) % halfCount], shuffledWomen[(baseIndex + 1) % halfCount]];
        } else {
          const pairKey = `${Math.min(team2Pair[0], team2Pair[1])}-${Math.max(team2Pair[0], team2Pair[1])}`;
          usedPairs.add(pairKey);
        }
        
        return {
          ...game,
          team1: team1Pair,
          team2: team2Pair
        };
      })
    )
  };
  
  console.log("=== ESTRUTURA GERADA ===");
  
  // Verificar se duplas se repetem
  const partnerships = new Set();
  let hasRepeatedPairs = false;
  let invalidPairs = 0;
  let validPairs = 0;
  
  mixedStructure.rounds.forEach((round, roundIndex) => {
    console.log(`RODADA ${roundIndex + 1}:`);
    
    round.forEach(game => {
      const team1 = game.team1.sort((a, b) => a - b);
      const team2 = game.team2.sort((a, b) => a - b);
      
      // Verificar gênero das duplas
      const team1Gender = team1.map(p => p <= halfCount ? 'M' : 'F');
      const team2Gender = team2.map(p => p <= halfCount ? 'M' : 'F');
      
      console.log(`  Jogo ${game.game}: [${team1.join(', ')}] (${team1Gender.join('-')}) vs [${team2.join(', ')}] (${team2Gender.join('-')})`);
      
      // Verificar se cada dupla tem 1 homem + 1 mulher
      const team1Valid = team1Gender.includes('M') && team1Gender.includes('F') && team1Gender.length === 2;
      const team2Valid = team2Gender.includes('M') && team2Gender.includes('F') && team2Gender.length === 2;
      
      if (team1Valid) validPairs++; else invalidPairs++;
      if (team2Valid) validPairs++; else invalidPairs++;
      
      if (!team1Valid) {
        console.log(`    ❌ DUPLA INVÁLIDA: ${team1.join('-')} (não tem 1H+1M)`);
      }
      if (!team2Valid) {
        console.log(`    ❌ DUPLA INVÁLIDA: ${team2.join('-')} (não tem 1H+1M)`);
      }
      
      // Verificar repetição
      const partnership1 = `${team1[0]}-${team1[1]}`;
      const partnership2 = `${team2[0]}-${team2[1]}`;
      
      if (partnerships.has(partnership1)) {
        console.log(`    ⚠️ DUPLA REPETIDA: ${partnership1}`);
        hasRepeatedPairs = true;
      } else {
        partnerships.add(partnership1);
      }
      
      if (partnerships.has(partnership2)) {
        console.log(`    ⚠️ DUPLA REPETIDA: ${partnership2}`);
        hasRepeatedPairs = true;
      } else {
        partnerships.add(partnership2);
      }
    });
    console.log();
  });
  
  console.log("=== RESUMO FINAL ===");
  console.log(`✅ Total de duplas únicas: ${partnerships.size}`);
  console.log(`${hasRepeatedPairs ? '❌' : '✅'} Duplas repetem: ${hasRepeatedPairs ? 'SIM' : 'NÃO'}`);
  console.log(`${validPairs > 0 ? '✅' : '❌'} Duplas válidas (1H+1M): ${validPairs}`);
  console.log(`${invalidPairs === 0 ? '✅' : '❌'} Duplas inválidas: ${invalidPairs}`);
  
  // Verificar quantos jogos cada jogador faz
  console.log("\n=== JOGOS POR JOGADOR ===");
  const playerGames = {};
  for (let i = 1; i <= 8; i++) {
    playerGames[i] = 0;
  }
  
  mixedStructure.rounds.forEach((round) => {
    round.forEach(game => {
      [...game.team1, ...game.team2].forEach(player => {
        playerGames[player]++;
      });
    });
  });
  
  let gamesBalanced = true;
  const gameCounts = Object.values(playerGames);
  const minGames = Math.min(...gameCounts);
  const maxGames = Math.max(...gameCounts);
  if (maxGames - minGames > 1) gamesBalanced = false;
  
  for (let i = 1; i <= 8; i++) {
    const gender = i <= halfCount ? 'M' : 'F';
    console.log(`Jogador ${i} (${gender}): ${playerGames[i]} jogos`);
  }
  console.log(`${gamesBalanced ? '✅' : '❌'} Jogos balanceados: ${gamesBalanced ? 'SIM' : 'NÃO'} (diferença máxima: ${maxGames - minGames})`);
  
  // Listar todas as duplas
  console.log("\n=== DUPLAS FORMADAS ===");
  Array.from(partnerships).sort().forEach((pair, index) => {
    const [p1, p2] = pair.split('-').map(Number);
    const g1 = p1 <= halfCount ? 'M' : 'F';
    const g2 = p2 <= halfCount ? 'M' : 'F';
    const isValid = (g1 === 'M' && g2 === 'F') || (g1 === 'F' && g2 === 'M');
    console.log(`${index + 1}. Dupla: ${pair} (${g1}-${g2}) ${isValid ? '✅' : '❌'}`);
  });
  
  // Determinar se a implementação está funcionando
  const success = !hasRepeatedPairs && validPairs > 0 && invalidPairs === 0 && gamesBalanced;
  console.log(`\n${success ? '🎾 SUCESSO' : '❌ PROBLEMA'}: Implementação de duplas mistas ${success ? 'está funcionando perfeitamente!' : 'precisa de ajustes'}`);
}

testMixedTournamentFinal();
