//Game.tsx
export const TIMEOUT = 10; //sec

export const SETTING_INPUTS_BY_LEVELS = {
  Beginner: { row: 8, column: 8, bomb: 10 },
  Intermediate: { row: 16, column: 16, bomb: 20 },
  Expert: { row: 16, column: 32, bomb: 50 },
  None: { row: 0, column: 0, bomb: 0 },
};

//Board.tsx
export const ADJACENT_CELLS_RELATIVE_LOCATIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
