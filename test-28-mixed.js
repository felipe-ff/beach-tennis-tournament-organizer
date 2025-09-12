// ===== ALGORITMO BALANCEADO DUPLAS MISTAS =====
function findBestMixedPair(availableMen, availableWomen, playerGameCount, usedPairs) {
    // Ordena homens e mulheres por quantidade de jogos (menos jogos primeiro)
    const sortedMen = [...availableMen].sort((a, b) => playerGameCount[a] - playerGameCount[b]);
    const sortedWomen = [...availableWomen].sort((a, b) => playerGameCount[a] - playerGameCount[b]);
    
    // Tenta formar dupla priorizando quem tem menos jogos
    for (const man of sortedMen) {
        for (const woman of sortedWomen) {
            const pairKey = `${man}-${woman}`;
            if (!usedPairs.has(pairKey)) {
                return [man, woman];
            }
        }
    }
    return null;
}

function createMixedTournamentStructure(players) {
    console.log("=== TESTE BALANCEADO DUPLAS MISTAS - 28 JOGADORES ===");
    console.log("14 Homens (1-14) + 14 Mulheres (15-28)");
    
    const men = players.filter(p => p.gender === 'M').map(p => p.id);
    const women = players.filter(p => p.gender === 'F').map(p => p.id);
    
    console.log("\n=== DISTRIBUIÇÃO DE GÊNEROS ===");
    console.log(`Homens: ${men.join(', ')}`);
    console.log(`Mulheres: ${women.join(', ')}`);
    
    // Análise matemática
    const totalPairs = men.length * women.length;
    const gamesPerRound = Math.floor(players.length / 4);
    const totalGames = 28; // Para 28 jogadores, queremos gerar 28 jogos
    const pairsNeeded = totalGames * 2;
    
    console.log("\n=== ANÁLISE DE COMBINAÇÕES ===");
    console.log(`Total de pares possíveis (H+M): ${totalPairs}`);
    console.log(`Total de jogos no torneio: ${totalGames}`);
    console.log(`Pares necessários (2 por jogo): ${pairsNeeded}`);
    
    // Controle de uso
    const usedPairs = new Set();
    const playerGameCount = {};
    players.forEach(p => playerGameCount[p.id] = 0);
    
    const games = [];
    let gameId = 1;
    let currentRound = 1;
    
    console.log("\n=== ESTRUTURA GERADA COM ALGORITMO BALANCEADO ===");
    
    for (let game = 0; game < totalGames; game++) {
        if (game > 0 && game % gamesPerRound === 0) {
            currentRound++;
        }
        
        if (game % gamesPerRound === 0) {
            console.log(`RODADA ${currentRound}:`);
        }
        
        // Encontra jogadores disponíveis (que têm menos jogos)
        const availableMen = men.filter(id => {
            const currentCount = playerGameCount[id];
            const minCount = Math.min(...men.map(m => playerGameCount[m]));
            return currentCount <= minCount + 1; // Permite até 1 jogo de diferença
        });
        
        const availableWomen = women.filter(id => {
            const currentCount = playerGameCount[id];
            const minCount = Math.min(...women.map(w => playerGameCount[w]));
            return currentCount <= minCount + 1; // Permite até 1 jogo de diferença
        });
        
        // Forma primeira dupla
        const pair1 = findBestMixedPair(availableMen, availableWomen, playerGameCount, usedPairs);
        if (!pair1) {
            console.log(`❌ Não foi possível formar primeira dupla no jogo ${game + 1}`);
            break;
        }
        
        // Marca primeira dupla como usada e atualiza contadores
        const pair1Key = `${pair1[0]}-${pair1[1]}`;
        usedPairs.add(pair1Key);
        playerGameCount[pair1[0]]++;
        playerGameCount[pair1[1]]++;
        
        // Atualiza disponíveis removendo jogadores da primeira dupla
        const remainingMen = availableMen.filter(id => id !== pair1[0]);
        const remainingWomen = availableWomen.filter(id => id !== pair1[1]);
        
        // Forma segunda dupla
        const pair2 = findBestMixedPair(remainingMen, remainingWomen, playerGameCount, usedPairs);
        if (!pair2) {
            console.log(`❌ Não foi possível formar segunda dupla no jogo ${game + 1}`);
            break;
        }
        
        // Marca segunda dupla como usada e atualiza contadores
        const pair2Key = `${pair2[0]}-${pair2[1]}`;
        usedPairs.add(pair2Key);
        playerGameCount[pair2[0]]++;
        playerGameCount[pair2[1]]++;
        
        // Cria o jogo
        const gameData = {
            id: gameId++,
            team1: {
                player1: { id: pair1[0], name: `Jogador ${pair1[0]}` },
                player2: { id: pair1[1], name: `Jogador ${pair1[1]}` }
            },
            team2: {
                player1: { id: pair2[0], name: `Jogador ${pair2[0]}` },
                player2: { id: pair2[1], name: `Jogador ${pair2[1]}` }
            }
        };
        
        games.push(gameData);
        
        console.log(`  Jogo ${game + 1}: [${pair1[0]}, ${pair1[1]}] (M-F) vs [${pair2[0]}, ${pair2[1]}] (M-F)`);
    }
    
    // ===== ANÁLISE DE RESULTADOS =====
    console.log("\n=== ANÁLISE DE BALANCEAMENTO ===");
    
    console.log("HOMENS:");
    men.forEach(id => {
        console.log(`  Homem ${id}: ${playerGameCount[id]} jogos`);
    });
    
    console.log("MULHERES:");
    women.forEach(id => {
        console.log(`  Mulher ${id}: ${playerGameCount[id]} jogos`);
    });
    
    // Estatísticas finais
    const allCounts = Object.values(playerGameCount);
    const minGames = Math.min(...allCounts);
    const maxGames = Math.max(...allCounts);
    const avgGames = allCounts.reduce((a, b) => a + b, 0) / allCounts.length;
    const difference = maxGames - minGames;
    
    // Verificação de duplas únicas
    const totalUniquePairs = usedPairs.size;
    const hasDuplicates = games.length * 2 !== totalUniquePairs;
    
    // Verificação de duplas mistas válidas
    let validMixedPairs = 0;
    let invalidPairs = 0;
    games.forEach(game => {
        // Time 1
        const t1p1Gender = game.team1.player1.id <= 14 ? 'M' : 'F';
        const t1p2Gender = game.team1.player2.id <= 14 ? 'M' : 'F';
        if (t1p1Gender !== t1p2Gender) validMixedPairs++; else invalidPairs++;
        
        // Time 2
        const t2p1Gender = game.team2.player1.id <= 14 ? 'M' : 'F';
        const t2p2Gender = game.team2.player2.id <= 14 ? 'M' : 'F';
        if (t2p1Gender !== t2p2Gender) validMixedPairs++; else invalidPairs++;
    });
    
    console.log("\n=== RESUMO FINAL ===");
    console.log(`${totalUniquePairs === games.length * 2 ? '✅' : '❌'} Total de duplas únicas: ${totalUniquePairs}`);
    console.log(`${!hasDuplicates ? '✅' : '❌'} Duplas repetem: ${hasDuplicates ? 'SIM' : 'NÃO'}`);
    console.log(`${validMixedPairs === games.length * 2 ? '✅' : '❌'} Duplas válidas (1H+1M): ${validMixedPairs}/${games.length * 2}`);
    console.log(`${invalidPairs === 0 ? '✅' : '❌'} Duplas inválidas: ${invalidPairs}`);
    console.log(`${difference === 0 ? '✅' : difference <= 1 ? '⚠️' : '❌'} Balanceamento: ${difference === 0 ? 'PERFEITO' : difference <= 1 ? 'BOM' : 'RUIM'} (diferença: ${difference})`);
    console.log(`🎯 Jogos por pessoa: min=${minGames}, max=${maxGames}, média=${avgGames.toFixed(1)}`);
    console.log(`📊 Utilização de pares: ${totalUniquePairs}/${totalPairs} (${(100 * totalUniquePairs / totalPairs).toFixed(1)}%)`);
    
    if (difference === 0) {
        console.log("\n🏆 EXCELENTE: Implementação para 28 jogadores está funcionando perfeitamente!");
    } else if (difference <= 1) {
        console.log("\n👍 BOM: Implementação para 28 jogadores está quase perfeita!");
    } else {
        console.log("\n❌ PROBLEMA: Balanceamento não está adequado para 28 jogadores.");
    }
    
    return { games, playerGameCount };
}

// ===== TESTE =====
const players28 = [];

// 14 homens (IDs 1-14)
for (let i = 1; i <= 14; i++) {
    players28.push({
        id: i,
        name: `Homem ${i}`,
        gender: 'M'
    });
}

// 14 mulheres (IDs 15-28)
for (let i = 15; i <= 28; i++) {
    players28.push({
        id: i,
        name: `Mulher ${i}`,
        gender: 'F'
    });
}

createMixedTournamentStructure(players28);
