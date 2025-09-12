// ===== TESTE BALANCEAMENTO PERFEITO COM REPETIÇÃO DE DUPLAS =====

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function testPerfectBalanceWithRepetition(playerCount, numTests = 5) {
  console.log(`=== BALANCEAMENTO PERFEITO (COM REPETIÇÃO) - ${playerCount} JOGADORES ===`);
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
    
    const getBalancedPair = (excludedPlayersInGame = new Set()) => {
      const availableMen = shuffledMen.filter(man => !excludedPlayersInGame.has(man));
      const availableWomen = shuffledWomen.filter(woman => !excludedPlayersInGame.has(woman));
      
      if (availableMen.length === 0 || availableWomen.length === 0) return null;
      
      const sortedMen = availableMen.sort((a, b) => playerGameCount[a] - playerGameCount[b]);
      const sortedWomen = availableWomen.sort((a, b) => playerGameCount[a] - playerGameCount[b]);
      
      return [sortedMen[0], sortedWomen[0]];
    };
    
    const games = [];
    const gamesPerRound = playerCount / 4;
    const totalRounds = 4;
    
    let woman13Games = [];
    let allSuccess = true;
    
    for (let round = 1; round <= totalRounds; round++) {
      for (let gameInRound = 0; gameInRound < gamesPerRound; gameInRound++) {
        const gameExcludedPlayers = new Set();
        
        const team1Pair = getBalancedPair(gameExcludedPlayers);
        if (team1Pair) {
          const [man1, woman1] = team1Pair;
          gameExcludedPlayers.add(man1);
          gameExcludedPlayers.add(woman1);
          playerGameCount[man1]++;
          playerGameCount[woman1]++;
        }
        
        const team2Pair = getBalancedPair(gameExcludedPlayers);
        if (team2Pair) {
          const [man2, woman2] = team2Pair;
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
    
    if (allSuccess) {
      // Verificar balanceamento
      const allCounts = Object.values(playerGameCount);
      const minGames = Math.min(...allCounts);
      const maxGames = Math.max(...allCounts);
      const difference = maxGames - minGames;
      
      console.log(`Balanceamento: min=${minGames}, max=${maxGames}, diferença=${difference}`);
      
      if (difference === 0 && woman13Games.includes(3)) {
        console.log("✅ PERFEITO! Balanceamento total e Mulher 13 joga na Rodada 3");
      } else if (difference === 0) {
        console.log("✅ BALANCEAMENTO PERFEITO! (Mulher 13 pode não jogar na Rodada 3)");
      } else if (woman13Games.includes(3)) {
        console.log(`⚠️ Mulher 13 joga na Rodada 3, mas balanceamento com diferença ${difference}`);
      } else {
        console.log("❌ Problemas no balanceamento ou Mulher 13 não joga na Rodada 3");
      }
      
      // Mostra jogos da Rodada 3 para debug
      if (woman13Games.includes(3)) {
        console.log("\n🎯 Jogos da Rodada 3 onde Mulher 13 participa:");
        const round3Games = games.filter(g => g.round === 3 && g.players.includes(13));
        round3Games.forEach((game, i) => {
          console.log(`  Jogo ${i + 1}: [${game.team1.join(',')}] vs [${game.team2.join(',')}]`);
        });
      }
      
    } else {
      console.log("❌ Algoritmo falhou");
    }
    
    console.log();
  }
}

testPerfectBalanceWithRepetition(20, 10);
