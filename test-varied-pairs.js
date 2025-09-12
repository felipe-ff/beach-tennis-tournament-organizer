// ===== ALGORITMO COM VARIAÇÃO DE DUPLAS =====

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createVariedPairsTournament(playerCount) {
  console.log(`=== ALGORITMO COM VARIAÇÃO DE DUPLAS - ${playerCount} JOGADORES ===`);
  
  const halfCount = playerCount / 2;
  const men = Array.from({ length: halfCount }, (_, i) => i + 1);
  const women = Array.from({ length: halfCount }, (_, i) => halfCount + i + 1);
  
  const playerGameCount = {};
  for (let i = 1; i <= playerCount; i++) {
    playerGameCount[i] = 0;
  }
  
  const usedPairs = new Map(); // Conta quantas vezes cada dupla foi usada
  const games = [];
  const gamesPerRound = playerCount / 4;
  const totalRounds = 4;
  
  // Função para obter dupla com base em diversidade e balanceamento
  const getBestPair = (excludedPlayersInGame, roundIndex) => {
    const availableMen = men.filter(man => !excludedPlayersInGame.has(man));
    const availableWomen = women.filter(woman => !excludedPlayersInGame.has(woman));
    
    if (availableMen.length === 0 || availableWomen.length === 0) return null;
    
    // Cria todas as combinações possíveis
    const possiblePairs = [];
    availableMen.forEach(man => {
      availableWomen.forEach(woman => {
        const pairKey = `${man}-${woman}`;
        const pairUsageCount = usedPairs.get(pairKey) || 0;
        const totalGames = playerGameCount[man] + playerGameCount[woman];
        
        possiblePairs.push({
          pair: [man, woman],
          pairKey,
          usageCount: pairUsageCount,
          totalGames,
          balanceScore: totalGames, // Menor é melhor
          diversityScore: pairUsageCount // Menor é melhor
        });
      });
    });
    
    // Ordena por diversidade primeiro (menos usadas), depois por balanceamento
    possiblePairs.sort((a, b) => {
      // Prioridade 1: Menos usadas
      if (a.diversityScore !== b.diversityScore) {
        return a.diversityScore - b.diversityScore;
      }
      // Prioridade 2: Melhor balanceamento
      if (a.balanceScore !== b.balanceScore) {
        return a.balanceScore - b.balanceScore;
      }
      // Prioridade 3: Variação baseada na rodada
      return (a.pair[0] + a.pair[1] + roundIndex) % 2 - (b.pair[0] + b.pair[1] + roundIndex) % 2;
    });
    
    return possiblePairs[0]?.pair || null;
  };
  
  console.log("\n=== JOGOS GERADOS ===");
  
  for (let round = 1; round <= totalRounds; round++) {
    console.log(`\nRODADA ${round}:`);
    
    for (let gameInRound = 0; gameInRound < gamesPerRound; gameInRound++) {
      const gameExcludedPlayers = new Set();
      
      // Primeira dupla
      const team1Pair = getBestPair(gameExcludedPlayers, round);
      if (team1Pair) {
        const [man1, woman1] = team1Pair;
        gameExcludedPlayers.add(man1);
        gameExcludedPlayers.add(woman1);
        playerGameCount[man1]++;
        playerGameCount[woman1]++;
        
        const pairKey1 = `${man1}-${woman1}`;
        usedPairs.set(pairKey1, (usedPairs.get(pairKey1) || 0) + 1);
      }
      
      // Segunda dupla
      const team2Pair = getBestPair(gameExcludedPlayers, round);
      if (team2Pair) {
        const [man2, woman2] = team2Pair;
        playerGameCount[man2]++;
        playerGameCount[woman2]++;
        
        const pairKey2 = `${man2}-${woman2}`;
        usedPairs.set(pairKey2, (usedPairs.get(pairKey2) || 0) + 1);
      }
      
      if (team1Pair && team2Pair) {
        console.log(`  Jogo ${gameInRound + 1}: [${team1Pair.join(',')}] vs [${team2Pair.join(',')}]`);
        games.push({
          round,
          game: gameInRound + 1,
          team1: team1Pair,
          team2: team2Pair
        });
      }
    }
  }
  
  // Análise das duplas
  console.log("\n=== ANÁLISE DE REPETIÇÕES ===");
  
  const repeatedPairs = [];
  const uniquePairs = [];
  
  usedPairs.forEach((count, pairKey) => {
    if (count > 1) {
      repeatedPairs.push({ pair: pairKey, count });
    } else {
      uniquePairs.push(pairKey);
    }
  });
  
  console.log(`\nTotal de duplas diferentes: ${usedPairs.size}`);
  console.log(`Duplas únicas (1x): ${uniquePairs.length}`);
  console.log(`Duplas repetidas: ${repeatedPairs.length}`);
  
  if (repeatedPairs.length > 0) {
    console.log("\n🔄 DUPLAS QUE SE REPETEM:");
    repeatedPairs.forEach(({ pair, count }) => {
      const [man, woman] = pair.split('-').map(Number);
      console.log(`  ${pair} (Homem ${man} + Mulher ${woman}): ${count} vezes`);
    });
  }
  
  // Balanceamento
  console.log("\n=== BALANCEAMENTO ===");
  const counts = Object.values(playerGameCount);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  
  console.log("HOMENS:");
  men.forEach(m => {
    console.log(`  Homem ${m}: ${playerGameCount[m]} jogos`);
  });
  
  console.log("MULHERES:");
  women.forEach(w => {
    console.log(`  Mulher ${w}: ${playerGameCount[w]} jogos`);
  });
  
  console.log(`\nJogos por pessoa: min=${min}, max=${max}, diferença=${max-min}`);
  
  // Verifica Mulher 13 na Rodada 3
  const round3Games = games.filter(g => g.round === 3);
  const mulher13Round3 = round3Games.some(g => 
    g.team1.includes(13) || g.team2.includes(13)
  );
  
  console.log(`Mulher 13 joga na Rodada 3? ${mulher13Round3 ? 'SIM' : 'NÃO'}`);
  
  if (max - min <= 1) {
    console.log("✅ EXCELENTE: Balanceamento quase perfeito!");
  } else {
    console.log(`⚠️ Balanceamento com diferença de ${max - min} jogos`);
  }
  
  console.log(`🎯 Diversidade: ${uniquePairs.length}/${usedPairs.size} duplas únicas (${((uniquePairs.length/usedPairs.size)*100).toFixed(1)}%)`);
}

// Testa o novo algoritmo
createVariedPairsTournament(20);
