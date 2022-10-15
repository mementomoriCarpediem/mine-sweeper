import { useState } from 'react';
import { CustomSettingsType, LevelType } from '../../store/slices/gameSlices';
import Board from '../Board/Board';
import GameMain from './Game.style';
import GameHeader from './GameHeader';

export const INITIAL_STATES: GameStates = {
  isGameOver: false,
  customGameSettingInputs: { row: 0, column: 0, bomb: 0 },
};

export type GameStates = {
  isGameOver: boolean;
  customGameSettingInputs: CustomSettingsType;
  level?: LevelType;
};

const Game = () => {
  const [states, setStates] = useState<GameStates>(INITIAL_STATES);
  const { isGameOver } = states;

  return (
    <GameMain.GameContainer>
      <GameHeader states={states} setStates={setStates} />

      {!isGameOver ? (
        <Board
          isGameOver={isGameOver}
          setIsGameOver={(value) => setStates({ ...states, isGameOver: value })}
        />
      ) : (
        <GameMain.EmptyText>게임 설정 값을 입력해주세요.</GameMain.EmptyText>
      )}
    </GameMain.GameContainer>
  );
};

export default Game;
