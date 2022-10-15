import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SETTING_INPUTS_BY_LEVELS } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store/config';
import {
  CustomSettingsType,
  initialState,
  LevelType,
  updateGameSettings,
} from '../../store/slices/gameSlices';
import { GameStates, INITIAL_STATES } from './Game';
import GameMain from './Game.style';

const LEVEL_OPTION_DEFAULT_TEXT = '난이도 선택';
type TimerStatus = 'ON' | 'OFF';

type Props = {
  states: GameStates;
  setStates: (state: GameStates) => void;
};

const GameHeader = ({ states, setStates }: Props) => {
  const { settings } = useAppSelector((state) => state.game);
  const { gameLevel, row, column, bomb } = settings;

  const dispatch = useAppDispatch();

  const {
    isGameOver,
    customGameSettingInputs: {
      row: customRow,
      column: customColumn,
      bomb: customBomb,
    },
    level,
  } = states;
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  useEffect(() => {
    console.log('[Game/useEffect] setting values from redux store', {
      gameLevel,
      row,
      column,
      bomb,
    });
  }, [bomb, column, gameLevel, row]);

  const levelInputRef = useRef<HTMLSelectElement>(null);

  const settingInputNameArray = [
    {
      name: 'column',
      text: '가로 길이',
      number: customColumn,
    },
    { name: 'row', text: '세로 길이', number: customRow },
    { name: 'bomb', text: '지뢰 수', number: customBomb },
  ];

  const onChangeLevelInput = (e: ChangeEvent<HTMLSelectElement>) => {
    setStates({ ...states, level: e.target.value as LevelType });
  };

  const onChangeCustomLevelInputs = (
    e: ChangeEvent<HTMLInputElement> & {
      target: { name: keyof CustomSettingsType; value: number };
    }
  ) => {
    const { name, value } = e.target;

    const dummyObject = { ...states.customGameSettingInputs };
    dummyObject[name] = Number(value);
    setStates({ ...states, customGameSettingInputs: dummyObject });
  };

  //change setting level inputs by level selection
  useEffect(() => {
    setStates({
      ...states,
      customGameSettingInputs: SETTING_INPUTS_BY_LEVELS[level ?? 'None'],
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    isGameOver && resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  let timer = useRef<NodeJS.Timeout>();

  const gameTimer = (timerStatus: TimerStatus) => {
    let seconds = timeElapsed;

    if (timerStatus === 'ON')
      timer.current = setInterval(() => setTimeElapsed(seconds++), 1000);

    if (timerStatus === 'OFF' && timer.current) clearInterval(timer.current);
  };

  const gameStart = () => {
    if (customRow && customColumn && customBomb) {
      dispatch(
        updateGameSettings({
          settings: {
            gameLevel: level,
            row: customRow,
            column: customColumn,
            bomb: customBomb,
          },
        })
      );
      gameTimer('ON');

      setStates({ ...states, isGameOver: false });
    } else window.alert('게임 설정 값을 모두 입력해주세요');
  };

  const resetGame = () => {
    setStates({ ...INITIAL_STATES, isGameOver: true });

    dispatch(updateGameSettings(initialState));

    gameTimer('OFF');

    if (levelInputRef.current)
      levelInputRef.current.value = LEVEL_OPTION_DEFAULT_TEXT;
  };

  return (
    <GameMain.Header>
      <GameMain.SubBox>
        <GameMain.TitleText>지뢰갯수</GameMain.TitleText>
        <GameMain.MineDisplay>{bomb} 개</GameMain.MineDisplay>
      </GameMain.SubBox>
      <GameMain.SubBox style={{ width: '100%' }}>
        <GameMain.LevelSelection
          onChange={onChangeLevelInput}
          ref={levelInputRef}
        >
          <GameMain.LevelOption>
            {LEVEL_OPTION_DEFAULT_TEXT}
          </GameMain.LevelOption>
          {Object.keys(LevelType).map((level) => (
            <GameMain.LevelOption key={level} value={level as LevelType}>
              {level}
            </GameMain.LevelOption>
          ))}
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
          {['Start', 'Reset'].map((buttonName) => (
            <GameMain.StartButton
              key={buttonName}
              onClick={buttonName === 'Start' ? gameStart : resetGame}
            >
              {buttonName}
            </GameMain.StartButton>
          ))}
        </GameMain.ButtonGroup>
      </GameMain.SubBox>

      <GameMain.SubBox>
        <GameMain.TitleText>소요시간</GameMain.TitleText>
        <GameMain.TimeDisplay>
          {!isGameOver ? timeElapsed : 0} 초
        </GameMain.TimeDisplay>
      </GameMain.SubBox>
    </GameMain.Header>
  );
};

export default GameHeader;
