import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection name in Firestore
const TOURNAMENTS_COLLECTION = 'tournaments';

// Serialize data for Firestore (convert nested arrays to objects)
const serializeForFirestore = (data) => {
  if (!data) return data;
  
  // Handle the games array
  const serializedGames = data.games ? data.games.map(game => ({
    ...game,
    team1: Array.isArray(game.team1) ? {
      players: game.team1
    } : game.team1,
    team2: Array.isArray(game.team2) ? {
      players: game.team2
    } : game.team2
  })) : [];

  // Handle the structure with nested rounds
  const serializedStructure = data.structure ? {
    rounds: data.structure.rounds ? data.structure.rounds.map((round, roundIndex) => ({
      roundIndex,
      games: Array.isArray(round) ? round.map(game => ({
        ...game,
        team1: Array.isArray(game.team1) ? {
          playerNumbers: game.team1
        } : game.team1,
        team2: Array.isArray(game.team2) ? {
          playerNumbers: game.team2
        } : game.team2
      })) : round
    })) : []
  } : null;

  return {
    ...data,
    games: serializedGames,
    structure: serializedStructure,
    // Convert players array to object if it exists
    players: Array.isArray(data.players) ? {
      list: data.players,
      count: data.players.length
    } : data.players
  };
};

// Deserialize data from Firestore (convert objects back to arrays)
const deserializeFromFirestore = (data) => {
  if (!data) return null;
  
  // Handle the games
  const deserializedGames = data.games ? data.games.map(game => ({
    ...game,
    team1: game.team1?.players || game.team1,
    team2: game.team2?.players || game.team2
  })) : [];

  // Handle the structure
  const deserializedStructure = data.structure ? {
    rounds: data.structure.rounds ? data.structure.rounds.map(round => {
      if (round.games) {
        // New format with games array
        return round.games.map(game => ({
          ...game,
          team1: game.team1?.playerNumbers || game.team1,
          team2: game.team2?.playerNumbers || game.team2
        }));
      } else {
        // Old format - direct array
        return round;
      }
    }) : []
  } : null;
  
  return {
    ...data,
    games: deserializedGames,
    structure: deserializedStructure,
    // Convert players object back to array if needed
    players: data.players?.list || data.players
  };
};

// Save tournament data to Firestore
export const saveTournament = async (tournamentId, tournamentData) => {
  try {
    const tournamentRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
    const serializedData = serializeForFirestore(tournamentData);
    
    await setDoc(tournamentRef, {
      ...serializedData,
      updatedAt: new Date(),
      createdAt: serializedData.createdAt || new Date()
    });
    console.log('Tournament saved successfully');
    return tournamentId;
  } catch (error) {
    console.error('Error saving tournament:', error);
    throw error;
  }
};

// Load tournament data from Firestore
export const loadTournament = async (tournamentId) => {
  try {
    const tournamentRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
    const tournamentSnap = await getDoc(tournamentRef);
    
    if (tournamentSnap.exists()) {
      const data = tournamentSnap.data();
      return deserializeFromFirestore(data);
    } else {
      console.log('No tournament found with ID:', tournamentId);
      return null;
    }
  } catch (error) {
    console.error('Error loading tournament:', error);
    throw error;
  }
};

// Update tournament data in Firestore (simplified version)
export const updateTournament = async (tournamentId, updates) => {
  try {
    // For safety, always use saveTournamentData for full updates
    return await saveTournamentData(tournamentId, updates);
  } catch (error) {
    console.error('Error updating tournament:', error);
    throw error;
  }
};

// Save/Replace entire tournament data in Firestore
export const saveTournamentData = async (tournamentId, tournamentData) => {
  try {
    const tournamentRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
    const serializedData = serializeForFirestore(tournamentData);
    
    await setDoc(tournamentRef, {
      ...serializedData,
      updatedAt: new Date(),
      createdAt: serializedData.createdAt || new Date()
    }, { merge: true });
    console.log('Tournament data saved successfully');
    return tournamentId;
  } catch (error) {
    console.error('Error saving tournament data:', error);
    throw error;
  }
};

// Delete tournament from Firestore
export const deleteTournament = async (tournamentId) => {
  try {
    const tournamentRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
    await deleteDoc(tournamentRef);
    console.log('Tournament deleted successfully');
  } catch (error) {
    console.error('Error deleting tournament:', error);
    throw error;
  }
};

// Listen to real-time updates for a tournament
export const subscribeTournament = (tournamentId, callback) => {
  const tournamentRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
  
  return onSnapshot(tournamentRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(deserializeFromFirestore(data));
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error listening to tournament updates:', error);
  });
};

// Generate a unique tournament ID
export const generateTournamentId = () => {
  return `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get tournaments by date from Firestore
export const getTournamentsByDate = async (date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const tournamentsRef = collection(db, TOURNAMENTS_COLLECTION);
    const q = query(
      tournamentsRef,
      where('createdAt', '>=', startOfDay),
      where('createdAt', '<=', endOfDay),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const tournaments = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tournaments.push({
        id: doc.id,
        name: data.tournamentName,
        createdAt: data.createdAt,
        password: data.password
      });
    });
    
    return tournaments;
  } catch (error) {
    console.error('Error getting tournaments by date:', error);
    return [];
  }
};

// Get current tournament ID from URL parameters only
export const getCurrentTournamentId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tournament');
};

// Set current tournament ID (URL only)
export const setCurrentTournamentId = (tournamentId) => {
  const url = new URL(window.location);
  url.searchParams.set('tournament', tournamentId);
  window.history.replaceState({}, '', url);
};
