// Análise de viabilidade para 12 jogadores
function check12Players() {
  console.log("=== ANÁLISE DE 12 JOGADORES ===\n");
  
  const playerCount = 12;
  const playersPerGame = 4;
  const gamesPerRound = playerCount / playersPerGame;
  
  console.log(`Total de jogadores: ${playerCount}`);
  console.log(`Jogadores por jogo: ${playersPerGame}`);
  console.log(`Jogos por rodada: ${gamesPerRound}`);
  
  if (gamesPerRound === Math.floor(gamesPerRound)) {
    console.log(`✅ Matematicamente VIÁVEL (${gamesPerRound} jogos por rodada)`);
    
    // Calcular quantos parceiros únicos cada jogador pode ter
    const totalGames = 4; // cada jogador joga 4 vezes
    const partnersPerPlayer = totalGames; // 1 parceiro diferente por jogo
    const totalPartnersNeeded = playerCount * partnersPerPlayer / 2; // dividido por 2 porque cada parceria é contada duas vezes
    const maxPossiblePartners = (playerCount - 1); // cada jogador pode fazer parceria com todos os outros exceto ele mesmo
    
    console.log(`\n=== ANÁLISE DE PARCEIROS ===`);
    console.log(`Cada jogador precisa de ${partnersPerPlayer} parceiros únicos`);
    console.log(`Máximo de parceiros possíveis: ${maxPossiblePartners}`);
    console.log(`Parceiros disponíveis suficientes: ${partnersPerPlayer <= maxPossiblePartners ? '✅ SIM' : '❌ NÃO'}`);
    
    // Calcular total de duplas possíveis
    const totalPossiblePairs = playerCount * (playerCount - 1) / 2; // combinações de 2 em 12
    const totalPairsNeeded = playerCount * totalGames / 2; // cada jogador joga 4 vezes, dividido por 2
    
    console.log(`\n=== ANÁLISE DE DUPLAS ===`);
    console.log(`Total de duplas possíveis: ${totalPossiblePairs}`);
    console.log(`Total de duplas necessárias: ${totalPairsNeeded}`);
    console.log(`Duplas suficientes: ${totalPairsNeeded <= totalPossiblePairs ? '✅ SIM' : '❌ NÃO'}`);
    
    if (totalPairsNeeded <= totalPossiblePairs && partnersPerPlayer <= maxPossiblePartners) {
      console.log(`\n🎾 CONCLUSÃO: 12 jogadores é VIÁVEL!`);
      console.log(`Estrutura: 4 rodadas com 3 jogos cada`);
      return true;
    } else {
      console.log(`\n❌ CONCLUSÃO: 12 jogadores NÃO é viável matematicamente`);
      return false;
    }
  } else {
    console.log(`❌ Matematicamente INVIÁVEL (${gamesPerRound} não é um número inteiro)`);
    return false;
  }
}

// Verificar também outros números menores
function checkSmallerNumbers() {
  console.log("\n=== VERIFICAÇÃO DE NÚMEROS MENORES ===\n");
  
  const counts = [8, 12, 16];
  
  counts.forEach(count => {
    const gamesPerRound = count / 4;
    const isViable = gamesPerRound === Math.floor(gamesPerRound);
    
    console.log(`${count} jogadores:`);
    console.log(`  Jogos por rodada: ${gamesPerRound} ${isViable ? '✅' : '❌'}`);
    console.log(`  Status: ${isViable ? 'VIÁVEL' : 'INVIÁVEL'}`);
    console.log();
  });
}

check12Players();
checkSmallerNumbers();
