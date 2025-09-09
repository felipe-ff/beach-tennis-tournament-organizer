// Script para verificar toda a estrutura corrigida
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
};

function verifyTournament() {
  console.log("=== VERIFICAÇÃO COMPLETA DA ESTRUTURA CORRIGIDA ===\n");
  
  // Verificar jogos por jogador
  const playerGames = {};
  for (let i = 1; i <= 20; i++) {
    playerGames[i] = 0;
  }
  
  // Verificar duplas
  const partnerships = new Set();
  
  tournamentStructure.rounds.forEach((round, roundIndex) => {
    console.log(`RODADA ${roundIndex + 1}:`);
    
    // Verificar se todos jogam uma vez por rodada
    const playersInRound = new Set();
    
    round.forEach(game => {
      const team1 = game.team1.sort((a, b) => a - b);
      const team2 = game.team2.sort((a, b) => a - b);
      
      console.log(`  Jogo ${game.game}: [${team1.join(', ')}] vs [${team2.join(', ')}]`);
      
      // Verificar duplicatas na rodada
      [...team1, ...team2].forEach(player => {
        if (playersInRound.has(player)) {
          console.log(`    ⚠️ JOGADOR ${player} JOGA MAIS DE UMA VEZ NESTA RODADA!`);
        }
        playersInRound.add(player);
        playerGames[player]++;
      });
      
      // Registrar duplas
      const partnership1 = `${team1[0]}-${team1[1]}`;
      const partnership2 = `${team2[0]}-${team2[1]}`;
      
      if (partnerships.has(partnership1)) {
        console.log(`    ⚠️ DUPLA REPETIDA: ${partnership1}`);
      } else {
        partnerships.add(partnership1);
      }
      
      if (partnerships.has(partnership2)) {
        console.log(`    ⚠️ DUPLA REPETIDA: ${partnership2}`);
      } else {
        partnerships.add(partnership2);
      }
    });
    
    console.log(`  Jogadores únicos na rodada: ${playersInRound.size}/20`);
    console.log();
  });
  
  // Verificar total de jogos por jogador
  console.log("=== JOGOS POR JOGADOR ===");
  let allPlayersOK = true;
  for (let i = 1; i <= 20; i++) {
    const games = playerGames[i];
    console.log(`Jogador ${i}: ${games} jogos ${games !== 4 ? '❌' : '✅'}`);
    if (games !== 4) allPlayersOK = false;
  }
  
  console.log(`\n=== RESUMO FINAL ===`);
  console.log(`✅ Todos jogam 4 jogos: ${allPlayersOK ? 'SIM' : 'NÃO'}`);
  console.log(`✅ Duplas únicas: ${partnerships.size}/40`);
  console.log(`✅ Estrutura válida: ${allPlayersOK && partnerships.size === 40 ? 'SIM' : 'NÃO'}`);
}

verifyTournament();
