// Criando estrutura otimizada para 12 jogadores
function create12PlayerStructure() {
  console.log("=== CRIANDO ESTRUTURA PARA 12 JOGADORES ===\n");
  
  // Estrutura manual otimizada
  const structure = {
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
        { game: 10, team1: [1, 7], team2: [11, 6] },
        { game: 11, team1: [2, 8], team2: [12, 5] },
        { game: 12, team1: [3, 9], team2: [4, 10] }
      ]
    ]
  };
  
  // Verificar a estrutura
  const playerGames = {};
  for (let i = 1; i <= 12; i++) {
    playerGames[i] = [0, 0, 0, 0]; // [R1, R2, R3, R4]
  }
  
  const partnerships = new Set();
  let isValid = true;
  
  structure.rounds.forEach((round, roundIndex) => {
    console.log(`RODADA ${roundIndex + 1}:`);
    const playersInRound = {};
    
    for (let i = 1; i <= 12; i++) {
      playersInRound[i] = 0;
    }
    
    round.forEach(game => {
      const allPlayers = [...game.team1, ...game.team2];
      console.log(`  Jogo ${game.game}: [${game.team1.join(', ')}] vs [${game.team2.join(', ')}]`);
      
      // Contar jogadores na rodada
      allPlayers.forEach(player => {
        playersInRound[player]++;
        playerGames[player][roundIndex]++;
      });
      
      // Registrar duplas
      const team1Sorted = game.team1.sort((a, b) => a - b);
      const team2Sorted = game.team2.sort((a, b) => a - b);
      const partnership1 = `${team1Sorted[0]}-${team1Sorted[1]}`;
      const partnership2 = `${team2Sorted[0]}-${team2Sorted[1]}`;
      
      if (partnerships.has(partnership1)) {
        console.log(`    ⚠️ DUPLA REPETIDA: ${partnership1}`);
        isValid = false;
      } else {
        partnerships.add(partnership1);
      }
      
      if (partnerships.has(partnership2)) {
        console.log(`    ⚠️ DUPLA REPETIDA: ${partnership2}`);
        isValid = false;
      } else {
        partnerships.add(partnership2);
      }
    });
    
    // Verificar se todos jogam uma vez
    for (let player = 1; player <= 12; player++) {
      if (playersInRound[player] !== 1) {
        console.log(`    ❌ Jogador ${player}: ${playersInRound[player]} jogos`);
        isValid = false;
      }
    }
    console.log();
  });
  
  // Resumo
  console.log("=== RESUMO POR JOGADOR ===");
  for (let player = 1; player <= 12; player++) {
    const games = playerGames[player];
    const total = games.reduce((a, b) => a + b, 0);
    const valid = games.every(g => g === 1) && total === 4;
    
    console.log(`Jogador ${player}: R1=${games[0]} R2=${games[1]} R3=${games[2]} R4=${games[3]} Total=${total} ${valid ? '✅' : '❌'}`);
    
    if (!valid) isValid = false;
  }
  
  console.log(`\nDuplas únicas: ${partnerships.size}/24`);
  console.log(`Estrutura válida: ${isValid ? '✅ SIM' : '❌ NÃO'}`);
  
  if (isValid) {
    console.log(`\n=== CÓDIGO PARA ADICIONAR AO ARQUIVO ===`);
    console.log(`12: {`);
    console.log(`  rounds: [`);
    structure.rounds.forEach((round, roundIndex) => {
      console.log(`    // Rodada ${roundIndex + 1}`);
      console.log(`    [`);
      round.forEach(game => {
        console.log(`      { game: ${game.game}, team1: [${game.team1.join(', ')}], team2: [${game.team2.join(', ')}] },`);
      });
      console.log(`    ]${roundIndex < 3 ? ',' : ''}`);
    });
    console.log(`  ]`);
    console.log(`},`);
  }
}

create12PlayerStructure();
