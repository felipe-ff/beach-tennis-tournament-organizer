// Tipos básicos para o torneio
export interface Player {
  id: number;
  name: string;
  gender?: 'M' | 'F';
}

export interface Game {
  id: number;
  round: number;
  team1: { number: number; name: string; gender?: 'M' | 'F' }[];
  team2: { number: number; name: string; gender?: 'M' | 'F' }[];
  score: { team1: number; team2: number };
  completed: boolean;
}

export interface GameStructure {
  game: number;
  team1: number[];
  team2: number[];
}

export interface TournamentStructure {
  rounds: GameStructure[][];
}

export interface PlayerStats {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesDrawn: number;
  gamesLost: number;
  pointsScored: number;
  pointsAgainst: number;
  pointsDifference: number;
  winPercentage: number;
}

export interface TournamentData {
  tournamentName: string;
  password: string;
  playerCount: number;
  players: string[];
  playerAssignment: Record<number, string>;
  games: Game[];
  structure: TournamentStructure | null;
  isMixed: boolean;
  createdAt: Date;
  updatedAt: Date;
  customPlayerNames?: Record<number, boolean>; // Keep for backward compatibility
}
