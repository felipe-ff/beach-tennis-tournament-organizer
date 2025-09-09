// Script para verificar especificamente a participação do jogador 3
const tournamentStructure = {
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
      { game: 10, team1: [17, 18], team2: [19, 20] }
    ],
    // Rodada 3
    [
      { game: 11, team1: [18, 2], team2: [20, 4] },
      { game: 12, team1: [5, 9], team2: [17, 11] },
      { game: 13, team1: [6, 10], team2: [18, 12] },
      { game: 14, team1: [7, 13], team2: [19, 15] },
      { game: 15, team1: [8, 14], team2: [3, 16] }
    ],
    // Rodada 4
    [
      { game: 16, team1: [1, 9], team2: [5, 17] },
      { game: 17, team1: [2, 10], team2: [6, 18] },
      { game: 18, team1: [3, 11], team2: [7, 19] },
      { game: 19, team1: [4, 12], team2: [8, 20] },
      { game: 20, team1: [13, 15], team2: [14, 16] }
    ]
  ]
};

function checkPlayer3() {
  console.log("=== VERIFICAÇÃO DO JOGADOR 3 ===\n");
  
  tournamentStructure.rounds.forEach((round, roundIndex) => {
    console.log(`RODADA ${roundIndex + 1}:`);
    let player3Found = false;
    
    round.forEach(game => {
      const allPlayers = [...game.team1, ...game.team2];
      if (allPlayers.includes(3)) {
        console.log(`  ✅ Jogo ${game.game}: [${game.team1.join(', ')}] vs [${game.team2.join(', ')}] - JOGADOR 3 PRESENTE`);
        player3Found = true;
      } else {
        console.log(`  ⚪ Jogo ${game.game}: [${game.team1.join(', ')}] vs [${game.team2.join(', ')}]`);
      }
    });
    
    if (!player3Found) {
      console.log(`  ❌ JOGADOR 3 NÃO JOGOU NESTA RODADA!`);
    }
    console.log();
  });
  
  // Contar jogos por rodada
  console.log("=== RESUMO JOGADOR 3 ===");
  tournamentStructure.rounds.forEach((round, roundIndex) => {
    let gamesInRound = 0;
    round.forEach(game => {
      const allPlayers = [...game.team1, ...game.team2];
      if (allPlayers.includes(3)) {
        gamesInRound++;
      }
    });
    console.log(`Rodada ${roundIndex + 1}: ${gamesInRound} jogo(s)`);
  });
}

checkPlayer3();
