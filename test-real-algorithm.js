// ===== TESTE EXATO DO ALGORITMO REAL =====

// Função shuffle (Fisher-Yates) igual à do código real
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Simula exatamente o createMixedTournamentStructure
function testRealAlgorithm(playerCount, numTests = 5) {
  console.log(`=== TESTE ALGORITMO REAL - ${playerCount} JOGADORES ===`);
  console.log(`Executando ${numTests} testes com embaralhamento aleatório\n`);
  
  for (let test = 1; test <= numTests; test++) {
    console.log(`--- TESTE ${test} ---`);
    
    const halfCount = playerCount / 2;
    const menNumbers = Array.from({ length: halfCount }, (_, i) => i + 1);
    const womenNumbers = Array.from({ length: halfCount }, (_, i) => halfCount + i + 1);
    
    // EXATAMENTE como no código real - embaralha
    const shuffledMen = shuffleArray(menNumbers);
    const shuffledWomen = shuffleArray(womenNumbers);
    
    console.log("Homens embaralhados:", shuffledMen.join(', '));
    console.log("Mulheres embaralhadas:", shuffledWomen.join(', '));
    
    // Track como no código real
    const playerGameCount = {};
    for (let i = 1; i <= playerCount; i++) {
      playerGameCount[i] = 0;
    }
    
    const usedPairs = new Set();
    
    // Function findBestMixedPair EXATA do código real
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
    
    // Simula a criação dos jogos
    const games = [];
    const gamesPerRound = playerCount / 4; // 20 jogadores = 5 jogos por rodada
    const totalGames = playerCount; // 20 jogos total
    let currentRound = 1;
    
    let woman13Games = [];
    
    for (let game = 0; game < totalGames; game++) {
      if (game > 0 && game % gamesPerRound === 0) {
        currentRound++;
      }
      
      // Criar jogo exatamente como no código real
      const gameExcludedPlayers = new Set();
      
      const team1Pair = findBestMixedPair(gameExcludedPlayers);
      if (team1Pair) {
        gameExcludedPlayers.add(team1Pair[0]);
        gameExcludedPlayers.add(team1Pair[1]);
      }
      
      const team2Pair = findBestMixedPair(gameExcludedPlayers);
      
      if (!team1Pair || !team2Pair) {
        console.log(`❌ Erro no jogo ${game + 1}`);
        break;
      }
      
      const gameData = {
        round: currentRound,
        team1: team1Pair,
        team2: team2Pair,
        players: [...team1Pair, ...team2Pair]
      };
      
      games.push(gameData);
      
      // Rastreia jogos da mulher 13
      if (gameData.players.includes(13)) {
        woman13Games.push(currentRound);
      }
    }
    
    // Análise da mulher 13
    const jogosRodada3 = games.filter(g => g.round === 3 && g.players.includes(13));
    const totalJogosMulher13 = playerGameCount[13];
    
    console.log(`Mulher 13 - Total de jogos: ${totalJogosMulher13}`);
    console.log(`Mulher 13 - Rodadas: ${woman13Games.join(', ')}`);
    console.log(`Mulher 13 - Joga na Rodada 3? ${woman13Games.includes(3) ? 'SIM' : 'NÃO'}`);
    
    if (!woman13Games.includes(3)) {
      console.log("❌ PROBLEMA ENCONTRADO! Mulher 13 não joga na Rodada 3");
      
      // Debug detalhado
      console.log("\nDEBUG - Jogos da Rodada 3:");
      games.filter(g => g.round === 3).forEach((g, i) => {
        console.log(`  Jogo ${i + 1}: [${g.team1.join(',')}] vs [${g.team2.join(',')}]`);
      });
      
      console.log("\nContagem antes da Rodada 3:");
      for (let i = 11; i <= 20; i++) {
        const count = games.filter(g => g.round < 3 && g.players.includes(i)).length;
        console.log(`  Mulher ${i}: ${count} jogos`);
      }
      
    } else {
      console.log("✅ OK - Mulher 13 joga na Rodada 3");
    }
    
    console.log();
  }
}

// Testa especificamente com 20 jogadores
testRealAlgorithm(20, 10); // 10 testes para maior probabilidade de encontrar o problema
