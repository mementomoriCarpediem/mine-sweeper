import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/config';
import {
  CustomSettingsType,
  LevelType,
  updateGameSettings,
} from '../../store/slices/gameSlices';

import { SETTING_INPUTS_BY_LEVELS, TIMEOUT } from '../../constants';

import Board from '../Board/Board';
import GameMain from './Game.style';

const Game = () => {
  const { settings } = useAppSelector((state) => state.game);
  const { gameLevel, row, column, bomb } = settings;

  useEffect(() => {
    console.log('[Game/useEffect] setting values from redux store', {
      gameLevel,
      row,
      column,
      bomb,
    });
  }, [bomb, column, gameLevel, row]);

  const levelInputRef = useRef<HTMLSelectElement>(null);

  const dispatch = useAppDispatch();

  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [level, setLevel] = useState<LevelType | ''>('');
  const [customGameSettingInputs, setCustomGameSettingInputs] =
    useState<CustomSettingsType>({ row: 0, column: 0, bomb: 0 });

  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  const settingInputNameArray = [
    {
      name: 'column',
      text: '가로 길이',
      number: customGameSettingInputs.column,
    },
    { name: 'row', text: '세로 길이', number: customGameSettingInputs.row },
    { name: 'bomb', text: '지뢰 수', number: customGameSettingInputs.bomb },
  ];

  const onChangeLevelInput = (e: ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value as LevelType);
  };

  const onChangeCustomLevelInputs = (
    e: ChangeEvent<HTMLInputElement> & {
      target: { name: keyof CustomSettingsType; value: number };
    }
  ) => {
    const { name, value } = e.target;

    const dummyObject = { ...customGameSettingInputs };
    dummyObject[name] = Number(value);
    setCustomGameSettingInputs(dummyObject);
  };

  //change setting level inputs by level selection
  useEffect(() => {
    switch (level) {
      case 'Beginner':
        setCustomGameSettingInputs(SETTING_INPUTS_BY_LEVELS.Beginner);
        break;
      case 'Intermediate':
        setCustomGameSettingInputs(SETTING_INPUTS_BY_LEVELS.Intermediate);
        break;
      case 'Expert':
        setCustomGameSettingInputs(SETTING_INPUTS_BY_LEVELS.Expert);
        break;
      case '':
        setCustomGameSettingInputs(SETTING_INPUTS_BY_LEVELS.None);
        break;
      default:
        console.log('[Game/useEffecgt] the level is not exist');
        break;
    }
  }, [level]);

  const gameStart = () => {
    if (
      customGameSettingInputs.row > 0 &&
      customGameSettingInputs.column > 0 &&
      customGameSettingInputs.bomb > 0
    ) {
      dispatch(
        updateGameSettings({
          settings: {
            gameLevel: level,
            row: customGameSettingInputs.row,
            column: customGameSettingInputs.column,
            bomb: customGameSettingInputs.bomb,
          },
        })
      );
      setIsGameStart(true);
      gameTimer('ON');
      setIsGameOver(false);
    } else {
      window.alert('게임 설정 값을 모두 입력해주세요');
    }
  };

  const resetGame = () => {
    setIsGameStart(false);
    setIsGameOver(true);
    gameTimer('OFF');
    setCustomGameSettingInputs({ row: 0, column: 0, bomb: 0 });
    if (levelInputRef.current) {
      levelInputRef.current.value = '';
    }
  };

  const gameTimer = (timerStatus: 'ON' | 'OFF') => {
    const start = Date.now();

    const timerCallback = () => {
      const timeDiff = Date.now() - start;

      if (Math.floor(timeDiff / 1000) <= TIMEOUT && timerStatus === 'ON') {
        setTimeElapsed(Math.floor(timeDiff / 1000));
      } else {
        timer && clearInterval(timer);
        setIsGameOver(true);
      }
    };

    const timer = setInterval(timerCallback, 1000);
  };

  return (
    <GameMain.GameContainer>
      <GameMain.Header>
        <GameMain.SubBox>
          <GameMain.TitleText>지뢰갯수</GameMain.TitleText>
          <GameMain.MineDisplay>{bomb} 개</GameMain.MineDisplay>
        </GameMain.SubBox>
        <GameMain.SubBox style={{ width: '100%' }}>
          <GameMain.LevelSelection
            onChange={(e) => onChangeLevelInput(e)}
            ref={levelInputRef}
          >
            <GameMain.LevelOption value="">난이도 선택</GameMain.LevelOption>
            <GameMain.LevelOption value="Beginner">
              Beginner
            </GameMain.LevelOption>
            <GameMain.LevelOption value="Intermediate">
              Intermediate
            </GameMain.LevelOption>
            <GameMain.LevelOption value="Expert">Expert</GameMain.LevelOption>
          </GameMain.LevelSelection>
          <GameMain.Setting>
            {settingInputNameArray.map((item) => {
              return (
                <GameMain.SettingInputLabel key={item.text}>
                  {item.text}
                  <GameMain.SettingInput
                    type="number"
                    name={item.name}
                    value={item.number}
                    min="0"
                    onChange={onChangeCustomLevelInputs}
                  />
                </GameMain.SettingInputLabel>
              );
            })}
          </GameMain.Setting>
          <GameMain.ButtonGroup>
            <GameMain.StartButton onClick={gameStart}>
              Start
            </GameMain.StartButton>
            <GameMain.ResetButton onClick={resetGame}>
              Reset
            </GameMain.ResetButton>
          </GameMain.ButtonGroup>
        </GameMain.SubBox>
        <GameMain.SubBox>
          <GameMain.TitleText>소요시간</GameMain.TitleText>
          <GameMain.TimeDisplay>
            {!isGameOver && isGameStart ? timeElapsed : 0} 초
          </GameMain.TimeDisplay>
        </GameMain.SubBox>
      </GameMain.Header>

      {isGameStart ? (
        <Board
          isGameStart={isGameStart}
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
        />
      ) : (
        <GameMain.EmptyText>게임 설정 값을 입력해주세요.</GameMain.EmptyText>
      )}
    </GameMain.GameContainer>
  );
};

export default Game;
