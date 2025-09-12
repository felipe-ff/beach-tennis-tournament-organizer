// ===== TESTE NOVO ALGORITMO DETERMINÍSTICO =====

// Função shuffle (Fisher-Yates)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Novo algoritmo determinístico
function testDeterministicAlgorithm(playerCount, numTests = 5) {
  console.log(`=== TESTE ALGORITMO DETERMINÍSTICO - ${playerCount} JOGADORES ===`);
  console.log(`Executando ${numTests} testes\n`);
  
  for (let test = 1; test <= numTests; test++) {
    console.log(`--- TESTE ${test} ---`);
    
    const halfCount = playerCount / 2;
    const menNumbers = Array.from({ length: halfCount }, (_, i) => i + 1);
    const womenNumbers = Array.from({ length: halfCount }, (_, i) => halfCount + i + 1);
    
    const shuffledMen = shuffleArray(menNumbers);
    const shuffledWomen = shuffleArray(womenNumbers);
    
    // Generate all possible mixed pairs
    const allPossiblePairs = [];
    shuffledMen.forEach(man => {
      shuffledWomen.forEach(woman => {
        allPossiblePairs.push([man, woman]);
      });
    });
    
    const shuffledPairs = shuffleArray(allPossiblePairs);
    
    // Create games
    const usedPairs = new Set();
    const playerGameCount = {};
    for (let i = 1; i <= playerCount; i++) {
      playerGameCount[i] = 0;
    }
    
    const games = [];
    const gamesPerRound = playerCount / 4;
    const totalRounds = 4;
    
    let woman13Games = [];
    let allSuccess = true;
    
    for (let round = 1; round <= totalRounds; round++) {
      const usedInRound = new Set();
      
      for (let gameInRound = 0; gameInRound < gamesPerRound; gameInRound++) {
        // Find available pairs
        const availablePairs = shuffledPairs.filter(([man, woman]) => {
          const pairKey = `${Math.min(man, woman)}-${Math.max(man, woman)}`;
          return !usedPairs.has(pairKey) && 
                 !usedInRound.has(man) && 
                 !usedInRound.has(woman);
        });
        
        // Sort by least used players
        availablePairs.sort(([manA, womanA], [manB, womanB]) => {
          const totalA = playerGameCount[manA] + playerGameCount[womanA];
          const totalB = playerGameCount[manB] + playerGameCount[womanB];
          return totalA - totalB;
        });
        
        let team1Pair = null;
        let team2Pair = null;
        
        if (availablePairs.length >= 2) {
          team1Pair = availablePairs[0];
          const [man1, woman1] = team1Pair;
          
          usedInRound.add(man1);
          usedInRound.add(woman1);
          usedPairs.add(`${Math.min(man1, woman1)}-${Math.max(man1, woman1)}`);
          playerGameCount[man1]++;
          playerGameCount[woman1]++;
          
          // Find second team
          const remainingPairs = availablePairs.filter(([man, woman]) => {
            return !usedInRound.has(man) && !usedInRound.has(woman);
          });
          
          if (remainingPairs.length > 0) {
            team2Pair = remainingPairs[0];
            const [man2, woman2] = team2Pair;
            
            usedInRound.add(man2);
            usedInRound.add(woman2);
            usedPairs.add(`${Math.min(man2, woman2)}-${Math.max(man2, woman2)}`);
            playerGameCount[man2]++;
            playerGameCount[woman2]++;
          }
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
        
        // Track woman 13
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
    } else if (!woman13Games.includes(3)) {
      console.log("❌ Mulher 13 não jogou na Rodada 3");
    } else {
      console.log("❌ Algoritmo falhou");
    }
    
    // Check balance
    if (allSuccess) {
      const allCounts = Object.values(playerGameCount);
      const minGames = Math.min(...allCounts);
      const maxGames = Math.max(...allCounts);
      const difference = maxGames - minGames;
      console.log(`Balanceamento: min=${minGames}, max=${maxGames}, diferença=${difference}`);
    }
    
    console.log();
  }
}

testDeterministicAlgorithm(20, 10);
