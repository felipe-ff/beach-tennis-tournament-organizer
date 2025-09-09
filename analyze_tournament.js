// Script para analisar a estrutura do torneio de 20 jogadores
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
      { game: 10, team1: [17, 1], team2: [19, 3] }
    ],
    // Rodada 3
    [
      { game: 11, team1: [18, 2], team2: [20, 4] },
      { game: 12, team1: [5, 9], team2: [17, 11] },
      { game: 13, team1: [6, 10], team2: [18, 12] },
      { game: 14, team1: [7, 13], team2: [19, 15] },
      { game: 15, team1: [8, 14], team2: [20, 16] }
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

function analyzeTournament() {
  console.log("=== ANÁLISE DO TORNEIO DE 20 JOGADORES ===\n");
  
  // Coletar todas as duplas
  const partnerships = new Set();
  const playerGames = {};
  
  // Inicializar contadores de jogos para cada jogador
  for (let i = 1; i <= 20; i++) {
    playerGames[i] = 0;
  }
  
  // Analisar cada rodada
  tournamentStructure.rounds.forEach((round, roundIndex) => {
    console.log(`RODADA ${roundIndex + 1}:`);
    
    round.forEach(game => {
      const team1 = game.team1.sort((a, b) => a - b);
      const team2 = game.team2.sort((a, b) => a - b);
      
      // Criar chaves únicas para as duplas
      const partnership1 = `${team1[0]}-${team1[1]}`;
      const partnership2 = `${team2[0]}-${team2[1]}`;
      
      console.log(`  Jogo ${game.game}: [${team1.join(', ')}] vs [${team2.join(', ')}]`);
      
      // Verificar se a dupla já existe
      if (partnerships.has(partnership1)) {
        console.log(`    ⚠️  DUPLA REPETIDA: ${partnership1}`);
      } else {
        partnerships.add(partnership1);
      }
      
      if (partnerships.has(partnership2)) {
        console.log(`    ⚠️  DUPLA REPETIDA: ${partnership2}`);
      } else {
        partnerships.add(partnership2);
      }
      
      // Contar jogos para cada jogador
      team1.forEach(player => playerGames[player]++);
      team2.forEach(player => playerGames[player]++);
    });
    console.log();
  });
  
  // Relatório de duplas únicas
  console.log("=== DUPLAS FORMADAS ===");
  const sortedPartnerships = Array.from(partnerships).sort();
  sortedPartnerships.forEach((partnership, index) => {
    console.log(`${index + 1}. Dupla: ${partnership}`);
  });
  console.log(`Total de duplas únicas: ${partnerships.size}\n`);
  
  // Relatório de jogos por jogador
  console.log("=== JOGOS POR JOGADOR ===");
  for (let i = 1; i <= 20; i++) {
    console.log(`Jogador ${i}: ${playerGames[i]} jogos`);
  }
  
  // Verificar se todos jogam a mesma quantidade
  const gameCounts = Object.values(playerGames);
  const minGames = Math.min(...gameCounts);
  const maxGames = Math.max(...gameCounts);
  
  console.log(`\n=== RESUMO ===`);
  console.log(`Menor número de jogos: ${minGames}`);
  console.log(`Maior número de jogos: ${maxGames}`);
  
  if (minGames === maxGames) {
    console.log(`✅ Todos os jogadores jogam a mesma quantidade (${minGames} jogos)`);
  } else {
    console.log(`❌ Jogadores jogam quantidades diferentes de jogos`);
  }
  
  // Verificar repetição de duplas
  const expectedUniquePairs = tournamentStructure.rounds.flat().length * 2;
  if (partnerships.size === expectedUniquePairs) {
    console.log(`✅ Nenhuma dupla se repete (${partnerships.size} duplas únicas)`);
  } else {
    console.log(`❌ Algumas duplas se repetem (${partnerships.size} duplas únicas de ${expectedUniquePairs} esperadas)`);
  }
  
  // Verificar se cada jogador joga com parceiros diferentes
  console.log(`\n=== VERIFICAÇÃO DE PARCEIROS ===`);
  const playerPartners = {};
  
  for (let i = 1; i <= 20; i++) {
    playerPartners[i] = new Set();
  }
  
  partnerships.forEach(partnership => {
    const [player1, player2] = partnership.split('-').map(Number);
    playerPartners[player1].add(player2);
    playerPartners[player2].add(player1);
  });
  
  for (let i = 1; i <= 20; i++) {
    const partners = Array.from(playerPartners[i]).sort((a, b) => a - b);
    console.log(`Jogador ${i} joga com: [${partners.join(', ')}] (${partners.length} parceiros diferentes)`);
  }
}

analyzeTournament();
