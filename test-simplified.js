// ===== TESTE ALGORITMO SIMPLIFICADO =====

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function testSimplifiedAlgorithm(playerCount, numTests = 5) {
  console.log(`=== TESTE ALGORITMO SIMPLIFICADO - ${playerCount} JOGADORES ===`);
  console.log(`Executando ${numTests} testes\n`);
  
  for (let test = 1; test <= numTests; test++) {
    console.log(`--- TESTE ${test} ---`);
    
    const halfCount = playerCount / 2;
    const shuffledMen = shuffleArray(Array.from({ length: halfCount }, (_, i) => i + 1));
    const shuffledWomen = shuffleArray(Array.from({ length: halfCount }, (_, i) => halfCount + i + 1));
    
    const playerGameCount = {};
    for (let i = 1; i <= playerCount; i++) {
      playerGameCount[i] = 0;
    }
    
    const usedPairs = new Set();
    
    const getBalancedPair = (excludedPlayers) => {
      const availableMen = shuffledMen
        .filter(man => !excludedPlayers.has(man))
        .sort((a, b) => playerGameCount[a] - playerGameCount[b]);
        
      const availableWomen = shuffledWomen
        .filter(woman => !excludedPlayers.has(woman))
        .sort((a, b) => playerGameCount[a] - playerGameCount[b]);
      
      for (const man of availableMen) {
        for (const woman of availableWomen) {
          const pairKey = `${man}-${woman}`;
          if (!usedPairs.has(pairKey)) {
            return [man, woman];
          }
        }
      }
      return null;
    };
    
    const games = [];
    const gamesPerRound = playerCount / 4;
    const totalRounds = 4;
    
    let woman13Games = [];
    let allSuccess = true;
    
    for (let round = 1; round <= totalRounds; round++) {
      const playersUsedInRound = new Set();
      
      for (let gameInRound = 0; gameInRound < gamesPerRound; gameInRound++) {
        const team1Pair = getBalancedPair(playersUsedInRound);
        
        if (team1Pair) {
          const [man1, woman1] = team1Pair;
          playersUsedInRound.add(man1);
          playersUsedInRound.add(woman1);
          
          usedPairs.add(`${man1}-${woman1}`);
          playerGameCount[man1]++;
          playerGameCount[woman1]++;
        }
        
        const combinedExcluded = new Set();
        playersUsedInRound.forEach(player => combinedExcluded.add(player));
        const team2Pair = getBalancedPair(combinedExcluded);
        
        if (team2Pair) {
          const [man2, woman2] = team2Pair;
          playersUsedInRound.add(man2);
          playersUsedInRound.add(woman2);
          
          usedPairs.add(`${man2}-${woman2}`);
          playerGameCount[man2]++;
          playerGameCount[woman2]++;
        }
        
        if (!team1Pair || !team2Pair) {
          console.log(`❌ Erro na Rodada ${round}, Jogo ${gameInRound + 1}`);
          allSuccess = false;
          break;
        }
        
        const gameData = {
          round: round,
          team1: team1Pair,
          team2: team2Pair,
          players: [...team1Pair, ...team2Pair]
        };
        
        games.push(gameData);
        
        if (gameData.players.includes(13)) {
          woman13Games.push(round);
        }
      }
      
      if (!allSuccess) break;
    }
    
    console.log(`Mulher 13 - Total de jogos: ${playerGameCount[13] || 0}`);
    console.log(`Mulher 13 - Rodadas: ${woman13Games.join(', ')}`);
    console.log(`Mulher 13 - Joga na Rodada 3? ${woman13Games.includes(3) ? 'SIM' : 'NÃO'}`);
    console.log(`Algoritmo executou com sucesso? ${allSuccess ? 'SIM' : 'NÃO'}`);
    
    if (allSuccess && woman13Games.includes(3)) {
      console.log("✅ PERFEITO!");
      
      // Verificar balanceamento
      const allCounts = Object.values(playerGameCount);
      const minGames = Math.min(...allCounts);
      const maxGames = Math.max(...allCounts);
      const difference = maxGames - minGames;
      console.log(`Balanceamento: min=${minGames}, max=${maxGames}, diferença=${difference}`);
      
    } else if (!woman13Games.includes(3)) {
      console.log("❌ Mulher 13 não jogou na Rodada 3");
    } else {
      console.log("❌ Algoritmo falhou");
    }
    
    console.log();
  }
}

testSimplifiedAlgorithm(20, 10);
