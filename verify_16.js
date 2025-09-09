// Verificação da estrutura de 16 jogadores
const tournamentStructure16 = {
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
};

function verify16Players() {
  console.log("=== VERIFICAÇÃO DE 16 JOGADORES ===\n");
  
  const playerGames = {};
  for (let i = 1; i <= 16; i++) {
    playerGames[i] = [0, 0, 0, 0]; // [R1, R2, R3, R4]
  }
  
  const partnerships = new Set();
  let hasErrors = false;
  
  tournamentStructure16.rounds.forEach((round, roundIndex) => {
    console.log(`RODADA ${roundIndex + 1}:`);
    const playersInRound = {};
    
    for (let i = 1; i <= 16; i++) {
      playersInRound[i] = 0;
    }
    
    round.forEach(game => {
      const allPlayers = [...game.team1, ...game.team2];
      console.log(`  Jogo ${game.game}: [${game.team1.join(', ')}] vs [${game.team2.join(', ')}]`);
      
      allPlayers.forEach(player => {
        playersInRound[player]++;
        playerGames[player][roundIndex]++;
        
        if (playersInRound[player] > 1) {
          console.log(`    ❌ JOGADOR ${player} JOGA MAIS DE UMA VEZ NESTA RODADA!`);
          hasErrors = true;
        }
      });
      
      // Registrar duplas
      const team1Sorted = game.team1.sort((a, b) => a - b);
      const team2Sorted = game.team2.sort((a, b) => a - b);
      const partnership1 = `${team1Sorted[0]}-${team1Sorted[1]}`;
      const partnership2 = `${team2Sorted[0]}-${team2Sorted[1]}`;
      
      if (partnerships.has(partnership1)) {
        console.log(`    ⚠️ DUPLA REPETIDA: ${partnership1}`);
        hasErrors = true;
      } else {
        partnerships.add(partnership1);
      }
      
      if (partnerships.has(partnership2)) {
        console.log(`    ⚠️ DUPLA REPETIDA: ${partnership2}`);
        hasErrors = true;
      } else {
        partnerships.add(partnership2);
      }
    });
    
    // Verificar quem não jogou
    for (let player = 1; player <= 16; player++) {
      if (playersInRound[player] === 0) {
        console.log(`    ⚠️ JOGADOR ${player} NÃO JOGOU NESTA RODADA`);
        hasErrors = true;
      }
    }
    
    const uniquePlayers = Object.values(playersInRound).filter(count => count === 1).length;
    console.log(`  Jogadores únicos: ${uniquePlayers}/16\n`);
  });
  
  // Resumo por jogador
  console.log("=== RESUMO POR JOGADOR ===");
  for (let player = 1; player <= 16; player++) {
    const games = playerGames[player];
    const total = games.reduce((a, b) => a + b, 0);
    const hasProblems = games.some(count => count !== 1) || total !== 4;
    
    console.log(`Jogador ${player}: R1=${games[0]} R2=${games[1]} R3=${games[2]} R4=${games[3]} Total=${total} ${hasProblems ? '❌' : '✅'}`);
    
    if (hasProblems) hasErrors = true;
  }
  
  // Verificar parceiros únicos
  console.log(`\n=== VERIFICAÇÃO DE PARCEIROS ===`);
  const playerPartners = {};
  
  for (let i = 1; i <= 16; i++) {
    playerPartners[i] = new Set();
  }
  
  partnerships.forEach(partnership => {
    const [player1, player2] = partnership.split('-').map(Number);
    playerPartners[player1].add(player2);
    playerPartners[player2].add(player1);
  });
  
  for (let i = 1; i <= 16; i++) {
    const partners = Array.from(playerPartners[i]).sort((a, b) => a - b);
    const expectedPartners = 4;
    const isCorrect = partners.length === expectedPartners;
    
    console.log(`Jogador ${i}: [${partners.join(', ')}] (${partners.length}/${expectedPartners} parceiros) ${isCorrect ? '✅' : '❌'}`);
    
    if (!isCorrect) hasErrors = true;
  }
  
  console.log(`\n=== RESULTADO FINAL ===`);
  console.log(`Estrutura de 16 jogadores: ${!hasErrors ? '✅ PERFEITA' : '❌ TEM PROBLEMAS'}`);
  console.log(`Duplas únicas: ${partnerships.size}/32`);
  console.log(`Todos jogam 4 vezes: ${!hasErrors ? '✅ SIM' : '❌ NÃO'}`);
  console.log(`Todos têm 4 parceiros únicos: ${!hasErrors ? '✅ SIM' : '❌ NÃO'}`);
  
  return !hasErrors;
}

verify16Players();
