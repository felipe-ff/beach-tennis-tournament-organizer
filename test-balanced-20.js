// Teste balanceado para 20 jogadores em duplas mistas (10 homens + 10 mulheres)

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function test20PlayersBalanced() {
  console.log("=== TESTE BALANCEADO DUPLAS MISTAS - 20 JOGADORES ===");
  console.log("10 Homens (1-10) + 10 Mulheres (11-20)\n");
  
  // Estrutura original para 20 jogadores
  const originalStructure = {
    rounds: [
      // Rodada 1
      [
        { game: 1, team1: [1, 2], team2: [3, 4] },
        { game: 2, team1: [5, 6], team2: [7, 8] },
        { game: 3, team1: [9, 10], team2: [11, 12] },
        { game: 4, team1: [13, 14], team2: [15, 16] },
        { game: 5, team1: [17, 18], team2: [19, 20] }
      ],
      // Rodada 2
      [
        { game: 6, team1: [1, 5], team2: [9, 13] },
        { game: 7, team1: [2, 6], team2: [10, 14] },
        { game: 8, team1: [3, 7], team2: [11, 15] },
        { game: 9, team1: [4, 8], team2: [12, 16] },
        { game: 10, team1: [17, 19], team2: [18, 20] }
      ],
      // Rodada 3
      [
        { game: 11, team1: [1, 9], team2: [5, 17] },
        { game: 12, team1: [2, 10], team2: [6, 18] },
        { game: 13, team1: [3, 11], team2: [7, 19] },
        { game: 14, team1: [4, 12], team2: [8, 20] },
        { game: 15, team1: [13, 15], team2: [14, 16] }
      ],
      // Rodada 4
      [
        { game: 16, team1: [1, 13], team2: [9, 17] },
        { game: 17, team1: [2, 14], team2: [10, 18] },
        { game: 18, team1: [3, 15], team2: [11, 19] },
        { game: 19, team1: [4, 16], team2: [12, 20] },
        { game: 20, team1: [5, 7], team2: [6, 8] }
      ]
    ]
  };
  
  const playerCount = 20;
  const halfCount = playerCount / 2; // 10
  const menNumbers = Array.from({ length: halfCount }, (_, i) => i + 1);      // [1,2,3,4,5,6,7,8,9,10]
  const womenNumbers = Array.from({ length: halfCount }, (_, i) => halfCount + i + 1); // [11,12,13,14,15,16,17,18,19,20]
  
  // Não embaralhar para ter resultados consistentes no teste
  const shuffledMen = menNumbers;
  const shuffledWomen = womenNumbers;
  
  console.log("=== DISTRIBUIÇÃO DE GÊNEROS ===");
  console.log(`Homens: ${shuffledMen.join(', ')}`);
  console.log(`Mulheres: ${shuffledWomen.join(', ')}\n`);
  
  // Implementar algoritmo balanceado
  const playerGameCount = {};
  for (let i = 1; i <= playerCount; i++) {
    playerGameCount[i] = 0;
  }
  
  const usedPairs = new Set();
  
  const findBestMixedPair = (excludedPlayers = new Set()) => {
    const availableMen = shuffledMen
      .filter(man => !excludedPlayers.has(man))
      .sort((a, b) => playerGameCount[a] - playerGameCount[b]);
    
    const availableWomen = shuffledWomen
      .filter(woman => !excludedPlayers.has(woman))
      .sort((a, b) => playerGameCount[a] - playerGameCount[b]);
    
    for (const man of availableMen) {
      for (const woman of availableWomen) {
        const pairKey = `${Math.min(man, woman)}-${Math.max(man, woman)}`;
        if (!usedPairs.has(pairKey)) {
          usedPairs.add(pairKey);
          playerGameCount[man]++;
          playerGameCount[woman]++;
          return [man, woman];
        }
      }
    }
    
    return null;
  };
  
  const mixedStructure = {
    rounds: originalStructure.rounds.map((round) => 
      round.map((game) => {
        const gameExcludedPlayers = new Set();
        
        const team1Pair = findBestMixedPair(gameExcludedPlayers);
        if (team1Pair) {
          gameExcludedPlayers.add(team1Pair[0]);
          gameExcludedPlayers.add(team1Pair[1]);
        }
        
        const team2Pair = findBestMixedPair(gameExcludedPlayers);
        
        if (!team1Pair || !team2Pair) {
          console.warn(`⚠️ Não foi possível encontrar pares balanceados para o jogo ${game.game}`);
          const fallbackMan1 = shuffledMen[0];
          const fallbackWoman1 = shuffledWomen[0];
          const fallbackMan2 = shuffledMen[1];
          const fallbackWoman2 = shuffledWomen[1];
          
          return {
            ...game,
            team1: team1Pair || [fallbackMan1, fallbackWoman1],
            team2: team2Pair || [fallbackMan2, fallbackWoman2]
          };
        }
        
        return {
          ...game,
          team1: team1Pair,
          team2: team2Pair
        };
      })
    )
  };
  
  // Análise dos resultados
  const partnerships = new Set();
  let hasRepeatedPairs = false;
  let invalidPairs = 0;
  let validPairs = 0;
  
  console.log("=== ESTRUTURA GERADA COM ALGORITMO BALANCEADO ===");
  
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
  
  // Análise final de balanceamento
  console.log("=== ANÁLISE DE BALANCEAMENTO ===");
  const gameCounts = Object.values(playerGameCount);
  const minGames = Math.min(...gameCounts);
  const maxGames = Math.max(...gameCounts);
  const perfectBalance = maxGames - minGames <= 0;
  
  // Separar por gênero
  console.log("HOMENS:");
  for (let i = 1; i <= halfCount; i++) {
    console.log(`  Homem ${i}: ${playerGameCount[i]} jogos`);
  }
  console.log("MULHERES:");
  for (let i = halfCount + 1; i <= playerCount; i++) {
    console.log(`  Mulher ${i}: ${playerGameCount[i]} jogos`);
  }
  
  console.log(`\n=== RESUMO FINAL ===`);
  console.log(`✅ Total de duplas únicas: ${partnerships.size}`);
  console.log(`${hasRepeatedPairs ? '❌' : '✅'} Duplas repetem: ${hasRepeatedPairs ? 'SIM' : 'NÃO'}`);
  console.log(`${validPairs === 40 ? '✅' : '❌'} Duplas válidas (1H+1M): ${validPairs}/40`);
  console.log(`${invalidPairs === 0 ? '✅' : '❌'} Duplas inválidas: ${invalidPairs}`);
  console.log(`${perfectBalance ? '✅' : '❌'} Balanceamento perfeito: ${perfectBalance ? 'SIM' : 'NÃO'} (diferença: ${maxGames - minGames})`);
  console.log(`📊 Jogos por pessoa: min=${minGames}, max=${maxGames}, média=${(gameCounts.reduce((a, b) => a + b, 0) / gameCounts.length).toFixed(1)}`);
  
  // Determinar sucesso
  const success = !hasRepeatedPairs && validPairs === 40 && invalidPairs === 0 && perfectBalance;
  console.log(`\n${success ? '🎾 PERFEITO' : '⚠️ ACEITÁVEL'}: Implementação ${success ? 'alcançou balanceamento perfeito!' : 'ainda precisa ajustes para balance perfeito'}`);
  
  return success;
}

test20PlayersBalanced();
