// ===== TESTE ALGORITMO CORRIGIDO =====

// Função shuffle (Fisher-Yates) igual à do código real
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Algoritmo CORRIGIDO
function testCorrectedAlgorithm(playerCount, numTests = 5) {
  console.log(`=== TESTE ALGORITMO CORRIGIDO - ${playerCount} JOGADORES ===`);
  console.log(`Executando ${numTests} testes com controle de duplicatas por rodada\n`);
  
  for (let test = 1; test <= numTests; test++) {
    console.log(`--- TESTE ${test} ---`);
    
    const halfCount = playerCount / 2;
    const menNumbers = Array.from({ length: halfCount }, (_, i) => i + 1);
    const womenNumbers = Array.from({ length: halfCount }, (_, i) => halfCount + i + 1);
    
    // Embaralha como no código real
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
    
    // Function findBestMixedPair CORRIGIDA
    const findBestMixedPair = (excludedPlayers = new Set(), usedThisRound = new Set()) => {
      const availableMen = shuffledMen
        .filter(man => !excludedPlayers.has(man) && !usedThisRound.has(man))
        .sort((a, b) => playerGameCount[a] - playerGameCount[b]);
      
      const availableWomen = shuffledWomen
        .filter(woman => !excludedPlayers.has(woman) && !usedThisRound.has(woman))
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
    
    // Simula a criação dos jogos COM CONTROLE POR RODADA
    const games = [];
    const gamesPerRound = playerCount / 4;
    const totalRounds = 4;
    
    let woman13Games = [];
    
    for (let round = 1; round <= totalRounds; round++) {
      const usedInRound = new Set(); // NOVO: controle por rodada
      
      for (let gameInRound = 0; gameInRound < gamesPerRound; gameInRound++) {
        const gameExcludedPlayers = new Set();
        
        const team1Pair = findBestMixedPair(gameExcludedPlayers, usedInRound);
        if (team1Pair) {
          gameExcludedPlayers.add(team1Pair[0]);
          gameExcludedPlayers.add(team1Pair[1]);
          usedInRound.add(team1Pair[0]); // NOVO: marca como usado na rodada
          usedInRound.add(team1Pair[1]);
        }
        
        const team2Pair = findBestMixedPair(gameExcludedPlayers, usedInRound);
        if (team2Pair) {
          usedInRound.add(team2Pair[0]); // NOVO: marca como usado na rodada
          usedInRound.add(team2Pair[1]);
        }
        
        if (!team1Pair || !team2Pair) {
          console.log(`❌ Erro na Rodada ${round}, Jogo ${gameInRound + 1}`);
          break;
        }
        
        const gameData = {
          round: round,
          team1: team1Pair,
          team2: team2Pair,
          players: [...team1Pair, ...team2Pair]
        };
        
        games.push(gameData);
        
        // Rastreia jogos da mulher 13
        if (gameData.players.includes(13)) {
          woman13Games.push(round);
        }
      }
    }
    
    // Análise da mulher 13
    const totalJogosMulher13 = playerGameCount[13];
    
    console.log(`Mulher 13 - Total de jogos: ${totalJogosMulher13}`);
    console.log(`Mulher 13 - Rodadas: ${woman13Games.join(', ')}`);
    console.log(`Mulher 13 - Joga na Rodada 3? ${woman13Games.includes(3) ? 'SIM' : 'NÃO'}`);
    
    if (!woman13Games.includes(3)) {
      console.log("❌ AINDA TEM PROBLEMA! Mulher 13 não joga na Rodada 3");
    } else {
      console.log("✅ CORRIGIDO - Mulher 13 joga na Rodada 3");
    }
    
    // Verifica se há duplicatas por rodada
    for (let round = 1; round <= totalRounds; round++) {
      const roundPlayers = [];
      games.filter(g => g.round === round).forEach(g => {
        roundPlayers.push(...g.players);
      });
      
      const uniquePlayers = new Set(roundPlayers);
      if (roundPlayers.length !== uniquePlayers.size) {
        console.log(`❌ DUPLICATA na Rodada ${round}!`);
        
        // Mostra as duplicatas
        const duplicates = roundPlayers.filter((p, i) => roundPlayers.indexOf(p) !== i);
        console.log(`  Jogadores duplicados: ${[...new Set(duplicates)].join(', ')}`);
      }
    }
    
    console.log();
  }
}

// Testa especificamente com 20 jogadores
testCorrectedAlgorithm(20, 10); // 10 testes
