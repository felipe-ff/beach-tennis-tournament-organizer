// Teste para validar numeração sequencial das mulheres

function testPlayerNumberingMixed(playerCount) {
    console.log(`=== TESTE NUMERAÇÃO DUPLAS MISTAS - ${playerCount} JOGADORES ===`);
    
    // Simula a criação de jogadores como no PlayerSetup.tsx
    const halfCount = playerCount / 2;
    const players = Array.from({ length: playerCount }, (_, index) => {
        if (index < halfCount) {
            return `Homem ${index + 1}`;
        } else {
            return `Mulher ${index + 1}`;
        }
    });
    
    console.log("Jogadores criados:");
    players.forEach((player, index) => {
        console.log(`  ${index + 1}. ${player}`);
    });
    
    // Simula a função assignPlayersToNumbersMixed
    const assignment = {};
    const men = players.slice(0, halfCount);
    const women = players.slice(halfCount);
    
    // Assign men to numbers 1 to halfCount
    men.forEach((player, index) => {
        assignment[index + 1] = player;
    });
    
    // Assign women to numbers (halfCount + 1) to playerCount
    women.forEach((player, index) => {
        assignment[halfCount + index + 1] = player;
    });
    
    console.log("\nAssociação Número -> Nome:");
    Object.keys(assignment).forEach(number => {
        console.log(`  Número ${number}: ${assignment[number]}`);
    });
    
    console.log(`\n✅ Homens: números 1 a ${halfCount}`);
    console.log(`✅ Mulheres: números ${halfCount + 1} a ${playerCount}`);
    console.log("---\n");
}

// Testa com diferentes quantidades
testPlayerNumberingMixed(20);
testPlayerNumberingMixed(24);
testPlayerNumberingMixed(28);
