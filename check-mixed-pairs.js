// PERMANENT SCRIPT: Check for repeated pairs in mixed doubles tournament
// This script analyzes the mixed doubles tournament structure to identify any repeated pairs and balance
// Usage: npx ts-node check-mixed-pairs.js [playerCount]
// Example: npx ts-node check-mixed-pairs.js 12

// Use the real tournament structure and mixed algorithm from the app
const { tournamentStructures } = require('./src/data/tournamentData');
const { createMixedTournamentStructure } = require('./src/utils/tournamentUtils');

function checkMixedRepeatedPairs() {
  console.log('=== CHECKING MIXED DOUBLES FOR REPEATED PAIRS ===');
  console.log('Date:', new Date().toLocaleString());
  console.log('');

  const argPlayerCount = parseInt(process.argv[2], 10);
  const playerCount = (!isNaN(argPlayerCount) && argPlayerCount > 0) ? argPlayerCount : 20;
  
  // Validate even number of players
  if (playerCount % 2 !== 0) {
    console.error(`Mixed doubles requires an even number of players. Got: ${playerCount}`);
    process.exit(1);
  }

  const halfCount = playerCount / 2;
  console.log(`Mixed doubles setup: ${halfCount} men (1-${halfCount}), ${halfCount} women (${halfCount + 1}-${playerCount})`);

  // Get the base tournament structure
  const baseStructure = tournamentStructures[playerCount];
  if (!baseStructure) {
    console.error(`No tournament structure found for ${playerCount} players.`);
    process.exit(1);
  }

  // Apply mixed doubles algorithm
  const mixedStructure = createMixedTournamentStructure(baseStructure, playerCount);

  // Check repeated pairs using the mixed tournament structure
  let gameCounter = 1;
  const pairOccurrences = new Map(); // pairKey -> [game numbers]
  
  console.log('=== MIXED DOUBLES TOURNAMENT STRUCTURE ===');
  mixedStructure.rounds.forEach((round, roundIndex) => {
    console.log(`\nRodada ${roundIndex + 1}:`);
    round.forEach((game) => {
      const team1 = game.team1;
      const team2 = game.team2;
      
      // Display with gender indicators
      const team1Display = `[♂️${team1[0]},♀️${team1[1]}]`;
      const team2Display = `[♂️${team2[0]},♀️${team2[1]}]`;
      console.log(`  Jogo ${gameCounter}: ${team1Display} vs ${team2Display}`);
      
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
  mixedStructure.rounds.forEach((round, roundIndex) => {
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

  // Check gender balance in teams
  let validMixedTeams = 0;
  let invalidTeams = [];
  const totalGames = gameCounter - 1;
  
  mixedStructure.rounds.forEach((round, roundIndex) => {
    round.forEach((game, gameIndex) => {
      const team1 = game.team1;
      const team2 = game.team2;
      
      // Check if team1 has one man and one woman
      const team1Valid = (team1[0] <= halfCount && team1[1] > halfCount) || (team1[0] > halfCount && team1[1] <= halfCount);
      // Check if team2 has one man and one woman  
      const team2Valid = (team2[0] <= halfCount && team2[1] > halfCount) || (team2[0] > halfCount && team2[1] <= halfCount);
      
      if (team1Valid) validMixedTeams++;
      else invalidTeams.push(`Game ${(roundIndex * round.length) + gameIndex + 1} Team1: [${team1[0]},${team1[1]}]`);
      
      if (team2Valid) validMixedTeams++;
      else invalidTeams.push(`Game ${(roundIndex * round.length) + gameIndex + 1} Team2: [${team2[0]},${team2[1]}]`);
    });
  });

  console.log(`\n=== MIXED DOUBLES VALIDATION ===`);
  console.log(`Total teams: ${totalGames * 2}`);
  console.log(`Valid mixed teams: ${validMixedTeams}`);
  console.log(`Invalid teams: ${invalidTeams.length}`);
  
  if (invalidTeams.length === 0) {
    console.log('✅ All teams are valid mixed doubles (1 man + 1 woman)');
  } else {
    console.log('❌ Invalid mixed teams found:');
    invalidTeams.forEach(team => console.log(`  ${team}`));
  }

  console.log(`\n=== GAME BALANCE CHECK ===`);
  console.log(`Players: ${Object.keys(playerGameCount).length}`);
  console.log(`Games per player: min=${minGames}, max=${maxGames}`);
  
  if (isBalanced) {
    console.log(`✅ Perfect balance! All players play exactly ${minGames} games`);
  } else {
    console.log(`❌ Unbalanced! Game difference: ${maxGames - minGames}`);
    console.log('\nPlayer game counts:');
    Object.entries(playerGameCount).sort(([,a], [,b]) => a - b).forEach(([player, games]) => {
      const gender = parseInt(player) <= halfCount ? '♂️' : '♀️';
      console.log(`  ${gender} Player ${player}: ${games} games`);
    });
  }

  console.log(`\n=== PAIR ANALYSIS ===`);
  console.log(`Total pairs: ${pairOccurrences.size}`);
  console.log(`Repeated pairs: ${repeatedPairs.length}`);
  if (repeatedPairs.length > 0) {
    console.log('\n=== REPEATED PAIRS DETAILS ===');
    repeatedPairs.forEach(([pairKey, games]) => {
      const [man, woman] = pairKey.split('-');
      console.log(`♂️${man}-♀️${woman} repeated in games: ${games.join(', ')}`);
    });
  } else {
    console.log('✅ No repeated pairs found!');
  }

  // Final summary
  console.log('\n=== MIXED DOUBLES TOURNAMENT QUALITY SUMMARY ===');
  console.log(`✅ Mixed Teams: ${invalidTeams.length === 0 ? 'PERFECT' : 'INVALID TEAMS FOUND'}`);
  console.log(`✅ Balance: ${isBalanced ? 'PERFECT' : 'UNBALANCED'}`);
  console.log(`✅ Diversity: ${repeatedPairs.length === 0 ? 'PERFECT' : 'HAS REPEATS'}`);
  
  if (isBalanced && repeatedPairs.length === 0 && invalidTeams.length === 0) {
    console.log('🎉 PERFECT MIXED DOUBLES TOURNAMENT STRUCTURE!');
  } else {
    console.log('⚠️  Tournament structure needs improvement');
  }

  return {
    isBalanced,
    hasRepeatedPairs: repeatedPairs.length > 0,
    hasInvalidTeams: invalidTeams.length > 0,
    playerGameCount,
    repeatedPairs,
    invalidTeams
  };
}

// Run the check
if (require.main === module) {
  checkMixedRepeatedPairs();
  console.log(`\nUsage: npx ts-node check-mixed-pairs.js [playerCount]`);
  console.log(`Example: npx ts-node check-mixed-pairs.js 12`);
}

module.exports = { checkMixedRepeatedPairs };
