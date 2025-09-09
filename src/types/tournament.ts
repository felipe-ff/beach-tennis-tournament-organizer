// Tipos básicos para o torneio
export interface Player {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  round: number;
  team1: { number: number; name: string }[];
  team2: { number: number; name: string }[];
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
  playerCount: number;
  players: string[];
  playerAssignment: Record<number, string>;
  games: Game[];
  structure: TournamentStructure | null;
  createdAt: Date;
  updatedAt: Date;
}
