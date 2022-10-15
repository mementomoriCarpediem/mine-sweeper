import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CustomSettingsType = Omit<GameType['settings'], 'gameLevel'>;
export enum LevelType {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
}

export interface GameType {
  settings: {
    row: number;
    column: number;
    bomb: number;
    gameLevel?: LevelType;
  };
}

export const initialState: GameType = {
  settings: {
    row: 0,
    column: 0,
    bomb: 0,
  },
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGameSettings(state, action: PayloadAction<GameType>) {
      state.settings = {
        gameLevel: action.payload.settings.gameLevel,
        row: action.payload.settings.row,
        column: action.payload.settings.column,
        bomb: action.payload.settings.bomb,
      };
    },
  },
});

export const { updateGameSettings } = gameSlice.actions;

export default gameSlice;
