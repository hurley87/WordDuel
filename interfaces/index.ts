export type User = {
  id: number;
  name: string;
};

export type Cursor = {
  y: number;
  x: number;
};

export type GameTile = {
  variant: 'empty' | 'correct' | 'present' | 'absent';
  children: string;
  cursor: Cursor;
};

export type GameGrid = GameTile[][];

export type GameStatus = 'new' | 'won' | 'lost';

export type Transaction = {
  to: string;
  from: string;
  value: string;
  timeStamp: string;
};

export type Player = {
  wallet: string;
  score: number;
};
