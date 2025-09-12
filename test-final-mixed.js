// Test final mixed doubles algorithm
function testFinalMixedAlgorithm() {
  console.log('=== TESTING FINAL MIXED DOUBLES ALGORITHM ===');
  
  const playerCount = 20;
  const halfCount = playerCount / 2;
  const menNumbers = Array.from({ length: halfCount }, (_, i) => i + 1);
  const womenNumbers = Array.from({ length: halfCount }, (_, i) => halfCount + i + 1);
  
  console.log('Men numbers:', menNumbers);
  console.log('Women numbers:', womenNumbers);
  
  // Create simple tournament structure
  const mixedStructure = {
    rounds: []
  };
  
  const playerGameCount = {};
  for (let i = 1; i <= playerCount; i++) {
    playerGameCount[i] = 0;
  }
  
  const usedPairs = new Map();
  const gamesPerRound = playerCount / 4; // 5 games per round
  const totalRounds = 4;
  
  // Best pair function - prioritizes diversity then balance
  const getBestPair = (excludedPlayersInGame, roundIndex) => {
    const availableMen = menNumbers.filter(man => !excludedPlayersInGame.has(man));
    const availableWomen = womenNumbers.filter(woman => !excludedPlayersInGame.has(woman));
    
    if (availableMen.length === 0 || availableWomen.length === 0) {
      return null;
    }
    
    // Create all possible pairs with scoring
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
          balanceScore: totalGames,
          diversityScore: pairUsageCount
        });
      });
    });
    
    // Sort by diversity first, then balance
    possiblePairs.sort((a, b) => {
      if (a.diversityScore !== b.diversityScore) {
        return a.diversityScore - b.diversityScore;
      }
      if (a.balanceScore !== b.balanceScore) {
        return a.balanceScore - b.balanceScore;
      }
      return (a.pair[0] + a.pair[1] + roundIndex) % 2 - (b.pair[0] + b.pair[1] + roundIndex) % 2;
    });
    
    return possiblePairs[0]?.pair || null;
  };
  
  // Generate rounds
  for (let round = 0; round < totalRounds; round++) {
    const roundGames = [];
    
    for (let gameInRound = 0; gameInRound < gamesPerRound; gameInRound++) {
      const gameExcludedPlayers = new Set();
      
      // First team
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
      
      // Second team
      const team2Pair = getBestPair(gameExcludedPlayers, round);
      if (team2Pair) {
        const [man2, woman2] = team2Pair;
        playerGameCount[man2]++;
        playerGameCount[woman2]++;
        
        const pairKey2 = `${man2}-${woman2}`;
        usedPairs.set(pairKey2, (usedPairs.get(pairKey2) || 0) + 1);
      }
      
      if (team1Pair && team2Pair) {
        roundGames.push({
          gameNumber: gameInRound + 1,
          team1: team1Pair,
          team2: team2Pair
        });
      }
    }
    
    mixedStructure.rounds.push(roundGames);
  }
  
  // Display results
  console.log('\n=== GENERATED STRUCTURE ===');
  mixedStructure.rounds.forEach((round, roundIndex) => {
    console.log(`\nRodada ${roundIndex + 1}:`);
    round.forEach((game, gameIndex) => {
      console.log(`  Jogo ${gameIndex + 1}: [${game.team1.join(',')}] vs [${game.team2.join(',')}]`);
    });
  });
  
  // Analysis
  console.log('\n=== ANALYSIS ===');
  
  // Balance check
  const counts = Object.values(playerGameCount);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  
  console.log('Player Game Count:');
  for (let i = 1; i <= 20; i++) {
    console.log(`  Player ${i}: ${playerGameCount[i]} games`);
  }
  
  console.log(`\nBalance: min=${min}, max=${max}, difference=${max-min}`);
  
  // Pair diversity
  let repeatedPairs = 0;
  let uniquePairs = 0;
  
  usedPairs.forEach((count, pairKey) => {
    if (count > 1) {
      repeatedPairs++;
      console.log(`Repeated pair ${pairKey}: ${count} times`);
    } else {
      uniquePairs++;
    }
  });
  
  console.log(`\nTotal pairs: ${usedPairs.size}`);
  console.log(`Unique pairs: ${uniquePairs}`);
  console.log(`Repeated pairs: ${repeatedPairs}`);
  console.log(`Diversity: ${(uniquePairs/usedPairs.size*100).toFixed(1)}%`);
  
  // Check Mulher 13 in Round 3
  const round3Games = mixedStructure.rounds[2];
  const mulher13Round3 = round3Games.some(game => 
    game.team1.includes(13) || game.team2.includes(13)
  );
  console.log(`\nMulher 13 plays in Round 3? ${mulher13Round3 ? 'YES' : 'NO'}`);
  
  if (max - min === 0) {
    console.log('✅ PERFECT balance achieved!');
  } else {
    console.log(`⚠️ Balance difference: ${max - min}`);
  }
  
  if (uniquePairs === usedPairs.size) {
    console.log('✅ PERFECT diversity - no repeated pairs!');
  } else {
    console.log(`⚠️ ${repeatedPairs} repeated pairs out of ${usedPairs.size}`);
  }
  
  return mixedStructure;
}

// Run test
testFinalMixedAlgorithm();
