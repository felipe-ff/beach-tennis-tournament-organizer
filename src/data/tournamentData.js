// Fixed tournament structures for each number of players
// Each person plays exactly 4 games and never plays with the same partner twice

export const tournamentStructures = {
  12: {
    rounds: [
      // Rodada 1
      [
        { game: 1, team1: [1, 2], team2: [3, 4] },
        { game: 2, team1: [5, 6], team2: [7, 8] },
        { game: 3, team1: [9, 10], team2: [11, 12] }
      ],
      // Rodada 2
      [
        { game: 4, team1: [1, 5], team2: [9, 3] },
        { game: 5, team1: [2, 6], team2: [10, 4] },
        { game: 6, team1: [7, 11], team2: [8, 12] }
      ],
      // Rodada 3
      [
        { game: 7, team1: [1, 9], team2: [5, 7] },
        { game: 8, team1: [2, 10], team2: [6, 8] },
        { game: 9, team1: [3, 11], team2: [4, 12] }
      ],
      // Rodada 4
      [
        { game: 10, team1: [1, 11], team2: [7, 4] },
        { game: 11, team1: [2, 12], team2: [8, 3] },
        { game: 12, team1: [5, 10], team2: [6, 9] }
      ]
    ]
  },
  16: {
    rounds: [
      // Rodada 1
      [
        { game: 1, team1: [1, 2], team2: [3, 4] },
        { game: 2, team1: [5, 6], team2: [7, 8] },
        { game: 3, team1: [9, 10], team2: [11, 12] },
        { game: 4, team1: [13, 14], team2: [15, 16] }
      ],
      // Rodada 2
      [
        { game: 5, team1: [1, 5], team2: [9, 13] },
        { game: 6, team1: [2, 6], team2: [10, 14] },
        { game: 7, team1: [3, 7], team2: [11, 15] },
        { game: 8, team1: [4, 8], team2: [12, 16] }
      ],
      // Rodada 3
      [
        { game: 9, team1: [1, 9], team2: [5, 13] },
        { game: 10, team1: [2, 10], team2: [6, 14] },
        { game: 11, team1: [3, 11], team2: [7, 15] },
        { game: 12, team1: [4, 12], team2: [8, 16] }
      ],
      // Rodada 4
      [
        { game: 13, team1: [1, 13], team2: [9, 5] },
        { game: 14, team1: [2, 14], team2: [10, 6] },
        { game: 15, team1: [3, 15], team2: [11, 7] },
        { game: 16, team1: [4, 16], team2: [12, 8] }
      ]
    ]
  },
  20: {
    rounds: [
      // Rodada 1
      [
        { game: 1, team1: [1, 2], team2: [3, 4] },
        { game: 2, team1: [5, 6], team2: [7, 8] },
        { game: 3, team1: [9, 10], team2: [11, 12] },
        { game: 4, team1: [13, 14], team2: [15, 16] },
        { game: 5, team1: [17, 18], team2: [19, 20] }
      ],
      // Rodada 2
      [
        { game: 6, team1: [1, 5], team2: [9, 13] },
        { game: 7, team1: [2, 6], team2: [10, 14] },
        { game: 8, team1: [3, 7], team2: [11, 15] },
        { game: 9, team1: [4, 8], team2: [12, 16] },
        { game: 10, team1: [17, 19], team2: [18, 20] }
      ],
      // Rodada 3
      [
        { game: 11, team1: [1, 9], team2: [5, 17] },
        { game: 12, team1: [2, 10], team2: [6, 18] },
        { game: 13, team1: [3, 11], team2: [7, 19] },
        { game: 14, team1: [4, 12], team2: [8, 20] },
        { game: 15, team1: [13, 15], team2: [14, 16] }
      ],
      // Rodada 4
      [
        { game: 16, team1: [1, 13], team2: [9, 17] },
        { game: 17, team1: [2, 14], team2: [10, 18] },
        { game: 18, team1: [3, 15], team2: [11, 19] },
        { game: 19, team1: [4, 16], team2: [12, 20] },
        { game: 20, team1: [5, 7], team2: [6, 8] }
      ]
    ]
  },
  24: {
    rounds: [
      // Rodada 1
      [
        { game: 1, team1: [1, 2], team2: [3, 4] },
        { game: 2, team1: [5, 6], team2: [7, 8] },
        { game: 3, team1: [9, 10], team2: [11, 12] },
        { game: 4, team1: [13, 14], team2: [15, 16] },
        { game: 5, team1: [17, 18], team2: [19, 20] },
        { game: 6, team1: [21, 22], team2: [23, 24] }
      ],
      // Rodada 2
      [
        { game: 7, team1: [1, 5], team2: [9, 13] },
        { game: 8, team1: [2, 6], team2: [10, 14] },
        { game: 9, team1: [3, 7], team2: [11, 15] },
        { game: 10, team1: [4, 8], team2: [12, 16] },
        { game: 11, team1: [17, 21], team2: [19, 23] },
        { game: 12, team1: [18, 22], team2: [20, 24] }
      ],
      // Rodada 3
      [
        { game: 13, team1: [1, 9], team2: [5, 17] },
        { game: 14, team1: [2, 10], team2: [6, 18] },
        { game: 15, team1: [3, 11], team2: [7, 19] },
        { game: 16, team1: [4, 12], team2: [8, 20] },
        { game: 17, team1: [13, 21], team2: [15, 23] },
        { game: 18, team1: [14, 22], team2: [16, 24] }
      ],
      // Rodada 4
      [
        { game: 19, team1: [1, 13], team2: [9, 21] },
        { game: 20, team1: [2, 14], team2: [10, 22] },
        { game: 21, team1: [3, 15], team2: [11, 23] },
        { game: 22, team1: [4, 16], team2: [12, 24] },
        { game: 23, team1: [5, 17], team2: [7, 19] },
        { game: 24, team1: [6, 18], team2: [8, 20] }
      ]
    ]
  },
  28: {
    rounds: [
      // Rodada 1
      [
        { game: 1, team1: [1, 2], team2: [3, 4] },
        { game: 2, team1: [5, 6], team2: [7, 8] },
        { game: 3, team1: [9, 10], team2: [11, 12] },
        { game: 4, team1: [13, 14], team2: [15, 16] },
        { game: 5, team1: [17, 18], team2: [19, 20] },
        { game: 6, team1: [21, 22], team2: [23, 24] },
        { game: 7, team1: [25, 26], team2: [27, 28] }
      ],
      // Rodada 2
      [
        { game: 8, team1: [1, 5], team2: [9, 13] },
        { game: 9, team1: [2, 6], team2: [10, 14] },
        { game: 10, team1: [3, 7], team2: [11, 15] },
        { game: 11, team1: [4, 8], team2: [12, 16] },
        { game: 12, team1: [17, 21], team2: [19, 23] },
        { game: 13, team1: [18, 22], team2: [20, 24] },
        { game: 14, team1: [25, 1], team2: [27, 3] }
      ],
      // Rodada 3
      [
        { game: 15, team1: [26, 2], team2: [28, 4] },
        { game: 16, team1: [5, 9], team2: [17, 25] },
        { game: 17, team1: [6, 10], team2: [18, 26] },
        { game: 18, team1: [7, 11], team2: [19, 27] },
        { game: 19, team1: [8, 12], team2: [20, 28] },
        { game: 20, team1: [13, 21], team2: [15, 23] },
        { game: 21, team1: [14, 22], team2: [16, 24] }
      ],
      // Rodada 4
      [
        { game: 22, team1: [1, 9], team2: [5, 17] },
        { game: 23, team1: [2, 10], team2: [6, 18] },
        { game: 24, team1: [3, 11], team2: [7, 19] },
        { game: 25, team1: [4, 12], team2: [8, 20] },
        { game: 26, team1: [13, 25], team2: [15, 27] },
        { game: 27, team1: [14, 26], team2: [16, 28] },
        { game: 28, team1: [21, 23], team2: [22, 24] }
      ]
    ]
  }
};

// Get available player counts
export const getAvailablePlayerCounts = () => {
  return Object.keys(tournamentStructures).map(Number).sort((a, b) => a - b);
};

// Get tournament structure for a specific number of players
export const getTournamentStructure = (playerCount) => {
  return tournamentStructures[playerCount] || null;
};
