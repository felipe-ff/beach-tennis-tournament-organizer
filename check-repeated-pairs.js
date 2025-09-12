// PERMANENT SCRIPT: Check for repeated pairs in mixed doubles tournament
// This script analyzes the mixed doubles tournament structure to identify any repeated pairs
// Usage: node check-repeated-pairs.js

// Use the real tournament structure from the app
const { tournamentStructures } = require('./src/data/tournamentData');

function checkRepeatedPairs() {
  console.log('=== CHECKING FOR REPEATED PAIRS ===');
  console.log('Date:', new Date().toLocaleString());
  console.log('');

  const argPlayerCount = parseInt(process.argv[2], 10);
  const playerCount = (!isNaN(argPlayerCount) && argPlayerCount > 0) ? argPlayerCount : 20;
  const structure = tournamentStructures[playerCount];
  if (!structure) {
    console.error(`No tournament structure found for ${playerCount} players.`);
    process.exit(1);
  }

  // Check repeated pairs using the real tournament structure
  let gameCounter = 1;
  const pairOccurrences = new Map(); // pairKey -> [game numbers]
  console.log('=== TOURNAMENT STRUCTURE ===');
  structure.rounds.forEach((round, roundIndex) => {
    console.log(`\nRodada ${roundIndex + 1}:`);
    round.forEach((game) => {
      const team1 = game.team1;
      const team2 = game.team2;
      console.log(`  Jogo ${gameCounter}: [${team1[0]},${team1[1]}] vs [${team2[0]},${team2[1]}]`);
      // Track team1 pair
      const pairKey1 = `${team1[0]}-${team1[1]}`;
      if (!pairOccurrences.has(pairKey1)) pairOccurrences.set(pairKey1, []);
      pairOccurrences.get(pairKey1).push(gameCounter);
      // Track team2 pair
      const pairKey2 = `${team2[0]}-${team2[1]}`;
      if (!pairOccurrences.has(pairKey2)) pairOccurrences.set(pairKey2, []);
      pairOccurrences.get(pairKey2).push(gameCounter);
      gameCounter++;
    });
  });

  // Find repeated pairs
  const repeatedPairs = Array.from(pairOccurrences.entries()).filter(([_, games]) => games.length > 1);
  
  // Check game balance per player
  const playerGameCount = {};
  structure.rounds.forEach((round, roundIndex) => {
    round.forEach((game) => {
      // Count games for each player
      [...game.team1, ...game.team2].forEach(player => {
        playerGameCount[player] = (playerGameCount[player] || 0) + 1;
      });
    });
  });

  const gameCounts = Object.values(playerGameCount);
  const minGames = Math.min(...gameCounts);
  const maxGames = Math.max(...gameCounts);
  const isBalanced = minGames === maxGames;

  console.log(`\n=== GAME BALANCE CHECK ===`);
  console.log(`Players: ${Object.keys(playerGameCount).length}`);
  console.log(`Games per player: min=${minGames}, max=${maxGames}`);
  
  if (isBalanced) {
    console.log(`✅ Perfect balance! All players play exactly ${minGames} games`);
  } else {
    console.log(`❌ Unbalanced! Game difference: ${maxGames - minGames}`);
    console.log('\nPlayer game counts:');
    Object.entries(playerGameCount).sort(([,a], [,b]) => a - b).forEach(([player, games]) => {
      console.log(`  Player ${player}: ${games} games`);
    });
  }

  console.log(`\n=== PAIR ANALYSIS ===`);
  console.log(`Total pairs: ${pairOccurrences.size}`);
  console.log(`Repeated pairs: ${repeatedPairs.length}`);
  if (repeatedPairs.length > 0) {
    console.log('\n=== REPEATED PAIRS DETAILS ===');
    repeatedPairs.forEach(([pairKey, games]) => {
      console.log(`Pair [${pairKey}] repeated in games: ${games.join(', ')}`);
    });
  } else {
    console.log('✅ No repeated pairs found!');
  }

  // Final summary
  console.log('\n=== TOURNAMENT QUALITY SUMMARY ===');
  console.log(`✅ Balance: ${isBalanced ? 'PERFECT' : 'UNBALANCED'}`);
  console.log(`✅ Diversity: ${repeatedPairs.length === 0 ? 'PERFECT' : 'HAS REPEATS'}`);
  if (isBalanced && repeatedPairs.length === 0) {
    console.log('🎉 PERFECT TOURNAMENT STRUCTURE!');
  }
}

// Run the check
if (require.main === module) {
  checkRepeatedPairs();
  console.log(`\nUsage: node check-repeated-pairs.js [playerCount]`);
  console.log(`Example: node check-repeated-pairs.js 12`);
}

module.exports = { checkRepeatedPairs };
