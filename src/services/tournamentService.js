import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot 
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

// Save tournament to localStorage as backup
export const saveToLocalStorage = (tournamentId, data) => {
  try {
    localStorage.setItem(`tournament_${tournamentId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Load tournament from localStorage as backup
export const loadFromLocalStorage = (tournamentId) => {
  try {
    const data = localStorage.getItem(`tournament_${tournamentId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Get current tournament ID from URL or localStorage
export const getCurrentTournamentId = () => {
  // Try to get from URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  const urlTournamentId = urlParams.get('tournament');
  
  if (urlTournamentId) {
    return urlTournamentId;
  }
  
  // Fall back to localStorage
  return localStorage.getItem('currentTournamentId');
};

// Set current tournament ID
export const setCurrentTournamentId = (tournamentId) => {
  localStorage.setItem('currentTournamentId', tournamentId);
  
  // Update URL without reload
  const url = new URL(window.location);
  url.searchParams.set('tournament', tournamentId);
  window.history.replaceState({}, '', url);
};
