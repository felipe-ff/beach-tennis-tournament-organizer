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
export const createTournamentState = (tournamentStructure: any, playerAssignment: Record<number, string>): Game[] => {
  const games: Game[] = [];
  let gameId = 1;

  tournamentStructure.rounds.forEach((round: any, roundIndex: number) => {
    round.forEach((gameTemplate: any) => {
      games.push({
        id: gameId++,
        round: roundIndex + 1,
        team1: gameTemplate.team1.map((num: number) => ({
          number: num,
          name: getPlayerNameByNumber(num, playerAssignment)
        })),
        team2: gameTemplate.team2.map((num: number) => ({
          number: num,
          name: getPlayerNameByNumber(num, playerAssignment)
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
