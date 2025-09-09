// Utility functions for tournament management

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Assign players to numbers randomly
export const assignPlayersToNumbers = (players) => {
  const shuffledPlayers = shuffleArray(players);
  const assignment = {};
  
  shuffledPlayers.forEach((player, index) => {
    assignment[index + 1] = player;
  });
  
  return assignment;
};

// Get player name by number
export const getPlayerNameByNumber = (playerNumber, playerAssignment) => {
  return playerAssignment[playerNumber] || `Jogador ${playerNumber}`;
};

// Create initial tournament state
export const createTournamentState = (tournamentStructure, playerAssignment) => {
  const games = [];
  let gameId = 1;
  
  tournamentStructure.rounds.forEach((round, roundIndex) => {
    round.forEach(gameTemplate => {
      games.push({
        id: gameId++,
        round: roundIndex + 1,
        team1: gameTemplate.team1.map(num => ({
          number: num,
          name: getPlayerNameByNumber(num, playerAssignment)
        })),
        team2: gameTemplate.team2.map(num => ({
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
export const calculatePlayerStats = (games, playerAssignment) => {
  const stats = {};
  
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
  games.forEach(game => {
    if (game.completed) {
      const team1Players = game.team1.map(p => p.number);
      const team2Players = game.team2.map(p => p.number);
      const team1Score = game.score.team1;
      const team2Score = game.score.team2;
      
      // Update stats for team1 players
      team1Players.forEach(playerNumber => {
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
      team2Players.forEach(playerNumber => {
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
  Object.values(stats).forEach(playerStats => {
    playerStats.pointsDifference = playerStats.pointsScored - playerStats.pointsAgainst;
    playerStats.winPercentage = playerStats.gamesPlayed > 0 
      ? Math.round((playerStats.gamesWon / playerStats.gamesPlayed) * 100)
      : 0;
  });
  
  return stats;
};

// Get games by round
export const getGamesByRound = (games) => {
  const gamesByRound = {};
  
  games.forEach(game => {
    if (!gamesByRound[game.round]) {
      gamesByRound[game.round] = [];
    }
    gamesByRound[game.round].push(game);
  });
  
  return gamesByRound;
};

// Update game score
export const updateGameScore = (games, gameId, newScore) => {
  return games.map(game => {
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
