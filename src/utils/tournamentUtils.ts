import { Game, PlayerStats } from '../types/tournament';

// Utility functions for tournament management

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Assign players for mixed doubles (men first half, women second half)
export const assignPlayersToNumbersMixed = (players: string[]): Record<number, string> => {
  const assignment: Record<number, string> = {};
  const halfCount = players.length / 2;
  
  // Split players into men and women based on their position in the array
  const men = players.slice(0, halfCount);
  const women = players.slice(halfCount);
  
  // Assign men to numbers 1 to halfCount
  men.forEach((player, index) => {
    assignment[index + 1] = player;
  });
  
  // Assign women to numbers (halfCount + 1) to players.length
  women.forEach((player, index) => {
    assignment[halfCount + index + 1] = player;
  });
  
  return assignment;
};

// Create mixed doubles structure ensuring every team has exactly one man and one woman
// with perfectly balanced game distribution and diverse pair combinations
export const createMixedTournamentStructure = (originalStructure: any, playerCount: number): any => {
  const halfCount = playerCount / 2;
  const menNumbers = Array.from({ length: halfCount }, (_, i) => i + 1);
  const womenNumbers = Array.from({ length: halfCount }, (_, i) => halfCount + i + 1);
  
  // Shuffle men and women separately for random assignment
  const shuffledMen = shuffleArray(menNumbers);
  const shuffledWomen = shuffleArray(womenNumbers);
  
  // Track player usage with perfect balance priority
  const playerGameCount: Record<number, number> = {};
  for (let i = 1; i <= playerCount; i++) {
    playerGameCount[i] = 0;
  }
  
  const usedPairs = new Map<string, number>();
  
  // Get best pair prioritizing diversity and balance
  const getBestPair = (excludedPlayersInGame: Set<number>, roundIndex: number): [number, number] | null => {
    const availableMen = menNumbers.filter(man => !excludedPlayersInGame.has(man));
    const availableWomen = womenNumbers.filter(woman => !excludedPlayersInGame.has(woman));
    
    if (availableMen.length === 0 || availableWomen.length === 0) {
      return null;
    }
    
    // Create all possible pairs with scoring
    const possiblePairs: Array<{
      pair: [number, number],
      pairKey: string,
      usageCount: number,
      totalGames: number,
      balanceScore: number,
      diversityScore: number
    }> = [];
    
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
          balanceScore: totalGames, // Lower is better
          diversityScore: pairUsageCount // Lower is better
        });
      });
    });
    
    // Sort by diversity first (less used), then by balance
    possiblePairs.sort((a, b) => {
      // Priority 1: Less used pairs
      if (a.diversityScore !== b.diversityScore) {
        return a.diversityScore - b.diversityScore;
      }
      // Priority 2: Better balance
      if (a.balanceScore !== b.balanceScore) {
        return a.balanceScore - b.balanceScore;
      }
      // Priority 3: Round-based variation
      return (a.pair[0] + a.pair[1] + roundIndex) % 2 - (b.pair[0] + b.pair[1] + roundIndex) % 2;
    });
    
    return possiblePairs[0]?.pair || null;
  };
  
  const mixedStructure = {
    rounds: originalStructure.rounds.map((round: any, roundIndex: number) => {
      const usedInRound = new Set<number>(); // Track players used in this round
      
      return round.map((game: any, gameIndex: number) => {
        const gameExcludedPlayers = new Set<number>();
        
        // Exclude players already used in this round
        usedInRound.forEach(player => gameExcludedPlayers.add(player));
        
        // Find first diverse pair with round variation
        const team1Pair = getBestPair(gameExcludedPlayers, roundIndex);
        
        if (team1Pair) {
          const [man1, woman1] = team1Pair;
          gameExcludedPlayers.add(man1);
          gameExcludedPlayers.add(woman1);
          usedInRound.add(man1);  // Add to round tracking
          usedInRound.add(woman1); // Add to round tracking
          playerGameCount[man1]++;
          playerGameCount[woman1]++;
          
          const pairKey1 = `${man1}-${woman1}`;
          usedPairs.set(pairKey1, (usedPairs.get(pairKey1) || 0) + 1);
        }
        
        // Find second diverse pair (different players from team1)
        const team2Pair = getBestPair(gameExcludedPlayers, roundIndex);
        
        if (team2Pair) {
          const [man2, woman2] = team2Pair;
          usedInRound.add(man2);  // Add to round tracking
          usedInRound.add(woman2); // Add to round tracking
          playerGameCount[man2]++;
          playerGameCount[woman2]++;
          
          const pairKey2 = `${man2}-${woman2}`;
          usedPairs.set(pairKey2, (usedPairs.get(pairKey2) || 0) + 1);
        }
        
        // Fallback - ensure we have valid teams
        const finalTeam1 = team1Pair || [menNumbers[gameIndex % menNumbers.length], womenNumbers[gameIndex % womenNumbers.length]];
        const finalTeam2 = team2Pair || [menNumbers[(gameIndex + 1) % menNumbers.length], womenNumbers[(gameIndex + 1) % womenNumbers.length]];
        
        return {
          ...game,
          team1: finalTeam1,
          team2: finalTeam2
        };
      });
    })
  };
  
  return mixedStructure;
};

// Get player gender based on their number (for mixed tournaments)
export const getPlayerGender = (playerNumber: number, playerCount: number): 'M' | 'F' => {
  const halfCount = playerCount / 2;
  return playerNumber <= halfCount ? 'M' : 'F';
};

// Assign players to numbers linearly (without shuffling)
export const assignPlayersToNumbersLinear = (players: string[]): Record<number, string> => {
  const assignment: Record<number, string> = {};
  
  players.forEach((player, index) => {
    assignment[index + 1] = player;
  });
  
  return assignment;
};

// Assign players to numbers randomly
export const assignPlayersToNumbers = (players: string[]): Record<number, string> => {
  const shuffledPlayers = shuffleArray(players);
  const assignment: Record<number, string> = {};
  
  shuffledPlayers.forEach((player, index) => {
    assignment[index + 1] = player;
  });
  
  return assignment;
};

// Get player name by number
export const getPlayerNameByNumber = (playerNumber: number, playerAssignment: Record<number, string>): string => {
  return playerAssignment[playerNumber] || `Jogador ${playerNumber}`;
};

// Create initial tournament state
export const createTournamentState = (tournamentStructure: any, playerAssignment: Record<number, string>, isMixed: boolean = false, playerCount: number = 0): Game[] => {
  const games: Game[] = [];
  let gameId = 1;
  
  // Use mixed structure if tournament is mixed doubles
  const finalStructure = isMixed ? createMixedTournamentStructure(tournamentStructure, playerCount) : tournamentStructure;

  finalStructure.rounds.forEach((round: any, roundIndex: number) => {
    round.forEach((gameTemplate: any) => {
      games.push({
        id: gameId++,
        round: roundIndex + 1,
        team1: gameTemplate.team1.map((num: number) => ({
          number: num,
          name: getPlayerNameByNumber(num, playerAssignment),
          ...(isMixed && { gender: getPlayerGender(num, playerCount) })
        })),
        team2: gameTemplate.team2.map((num: number) => ({
          number: num,
          name: getPlayerNameByNumber(num, playerAssignment),
          ...(isMixed && { gender: getPlayerGender(num, playerCount) })
        })),
        score: {
          team1: 0,
          team2: 0
        },
        completed: false
      });
    });
  });
  
  return games;
};

// Calculate player statistics
export const calculatePlayerStats = (games: Game[], playerAssignment: Record<number, string>): Record<number, PlayerStats> => {
  const stats: Record<number, PlayerStats> = {};
  
  // Initialize stats for all players
  Object.keys(playerAssignment).forEach(number => {
    const playerNumber = parseInt(number);
    stats[playerNumber] = {
      name: playerAssignment[playerNumber],
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDrawn: 0,
      pointsScored: 0,
      pointsAgainst: 0,
      pointsDifference: 0,
      winPercentage: 0
    };
  });
  
  // Calculate stats from completed games
  games.forEach((game: Game) => {
    if (game.completed) {
      const team1Players = game.team1.map((p: { number: number; name: string }) => p.number);
      const team2Players = game.team2.map((p: { number: number; name: string }) => p.number);
      const team1Score = game.score.team1;
      const team2Score = game.score.team2;
      
      // Update stats for team1 players
      team1Players.forEach((playerNumber: number) => {
        const playerStats = stats[playerNumber];
        playerStats.gamesPlayed++;
        playerStats.pointsScored += team1Score;
        playerStats.pointsAgainst += team2Score;
        
        if (team1Score > team2Score) {
          playerStats.gamesWon++;
        } else if (team1Score < team2Score) {
          playerStats.gamesLost++;
        } else {
          playerStats.gamesDrawn++;
        }
      });
      
      // Update stats for team2 players
      team2Players.forEach((playerNumber: number) => {
        const playerStats = stats[playerNumber];
        playerStats.gamesPlayed++;
        playerStats.pointsScored += team2Score;
        playerStats.pointsAgainst += team1Score;
        
        if (team2Score > team1Score) {
          playerStats.gamesWon++;
        } else if (team2Score < team1Score) {
          playerStats.gamesLost++;
        } else {
          playerStats.gamesDrawn++;
        }
      });
    }
  });
  
  // Calculate derived stats
  Object.values(stats).forEach((playerStats: PlayerStats) => {
    playerStats.pointsDifference = playerStats.pointsScored - playerStats.pointsAgainst;
    playerStats.winPercentage = playerStats.gamesPlayed > 0 
      ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100)
      : 0;
  });
  
  return stats;
};

// Get games by round
export const getGamesByRound = (games: Game[]): Record<number, Game[]> => {
  const gamesByRound: Record<number, Game[]> = {};
  
  games.forEach((game: Game) => {
    if (!gamesByRound[game.round]) {
      gamesByRound[game.round] = [];
    }
    gamesByRound[game.round].push(game);
  });
  
  return gamesByRound;
};

// Update game score
export const updateGameScore = (games: Game[], gameId: number, newScore: { team1: number; team2: number }): Game[] => {
  return games.map((game: Game) => {
    if (game.id === gameId) {
      return {
        ...game,
        score: newScore,
        completed: true // Sempre marca como completo quando o placar é atualizado
      };
    }
    return game;
  });
};
