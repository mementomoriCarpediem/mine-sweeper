import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/config';
import {
  CustomSettingsType,
  LevelType,
  updateGameSettings,
} from '../../store/slices/gameSlices';
import Board from '../Board/Board';

const TIMEOUT = 5; //sec

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

  const inputNameArray = [
    { name: 'row', text: '가로 길이', number: customGameSettingInputs.row },
    {
      name: 'column',
      text: '세로 길이',
      number: customGameSettingInputs.column,
    },
    { name: 'bomb', text: '지뢰 수', number: customGameSettingInputs.bomb },
  ];

  const onChangeLevelInput = (e: ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value as LevelType);
    return level;
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
        setCustomGameSettingInputs({
          row: 8,
          column: 8,
          bomb: 5,
        });
        break;
      case 'Intermediate':
        setCustomGameSettingInputs({
          row: 16,
          column: 16,
          bomb: 10,
        });
        break;
      case 'Expert':
        setCustomGameSettingInputs({
          row: 32,
          column: 16,
          bomb: 20,
        });
        break;
      case '':
        setCustomGameSettingInputs({
          row: 0,
          column: 0,
          bomb: 0,
        });
        break;

      default:
        console.log('[Game/useEffect] custom settting..');
        break;
    }
  }, [level]);

  const resetGame = () => {
    console.log('reset game');
    if (levelInputRef.current) {
      levelInputRef.current.value = '';
    }
    setCustomGameSettingInputs({ row: 0, column: 0, bomb: 0 });
    setIsGameStart(false);
    setIsGameOver(false);
  };

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
      gameTimer();
      setIsGameOver(false);
    } else {
      window.alert('게임 설정 값을 모두 입력해주세요');
    }
  };

  const gameTimer = () => {
    const start = Date.now();

    const timerCallback = () => {
      const timeDiff = Date.now() - start;
      if (Math.floor(timeDiff / 1000) <= TIMEOUT) {
        setTimeElapsed(Math.floor(timeDiff / 1000));
      } else {
        clearInterval(timer);
        setIsGameOver(true);
        if (levelInputRef.current) {
          levelInputRef.current.value = '';
        }
        setCustomGameSettingInputs({ row: 0, column: 0, bomb: 0 });
      }
    };

    const timer = setInterval(timerCallback, 1000);
  };

  return (
    <GameContainer>
      <HeaderContainer>
        <SubBox>
          <TitleText>지뢰갯수</TitleText>
          <MineDisplay>{bomb} 개</MineDisplay>
        </SubBox>
        <SubBox style={{ width: '100%' }}>
          <LevelSelection
            onChange={(e) => onChangeLevelInput(e)}
            ref={levelInputRef}
          >
            <LevelOption value="">난이도 선택</LevelOption>
            <LevelOption value="Beginner">Beginner</LevelOption>
            <LevelOption value="Intermediate">Intermediate</LevelOption>
            <LevelOption value="Expert">Expert</LevelOption>
          </LevelSelection>
          <SettingContainer>
            {inputNameArray.map((item) => {
              return (
                <SettingInputLabel key={item.text}>
                  {item.text}
                  <SettingInput
                    type="number"
                    name={item.name}
                    value={item.number}
                    min="0"
                    onChange={onChangeCustomLevelInputs}
                  />
                </SettingInputLabel>
              );
            })}
          </SettingContainer>
          <ButtonGroup>
            <StartButton onClick={gameStart}>Start</StartButton>
            <ResetButton onClick={resetGame}>Reset</ResetButton>
          </ButtonGroup>
        </SubBox>
        <SubBox>
          <TitleText>소요시간</TitleText>
          <TimeDisplay> {timeElapsed} 초</TimeDisplay>
        </SubBox>
      </HeaderContainer>

      {isGameStart ? (
        <Board
          isGameStart={isGameStart}
          setIsGameStart={setIsGameStart}
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
        />
      ) : (
        <EmptyText>게임 설정 값을 입력해주세요.</EmptyText>
      )}
    </GameContainer>
  );
};

export default Game;

const GameContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  min-height: 400px;
  margin: auto;
  margin-top: 5rem;
  border: 2px solid black;
  border-radius: 5px;
`;

const HeaderContainer = styled.section`
  display: flex;
  justify-content: space-around;
  width: 100%;
  background-color: ${(props) => props.theme.colors.main};
  border-bottom: 2px solid black;
`;

const SettingContainer = styled.section`
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin: 1rem 0;
`;

const SettingInput = styled.input`
  width: 50%;
  height: 1rem;
  /* margin-left: 1rem; */
`;

const SettingInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SubBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 1rem;
`;

const TitleText = styled.p`
  font-weight: 700;
`;

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 2rem;
  background-color: ${(props) => props.theme.colors.sub2};
  border-radius: 5px;
`;

const MineDisplay = styled(TimeDisplay)``;

const ButtonGroup = styled.div``;

const ResetButton = styled.button`
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 15px;
  margin-left: 1rem;
  border-width: 0;
  width: 5rem;
  background-color: salmon;
  border-radius: ${(props) => props.theme.borderRadius};
`;

const StartButton = styled(ResetButton)`
  color: white;
  background-color: blue;
`;

const LevelSelection = styled.select`
  width: 9rem;
  font-size: 1rem;
  font-weight: 500;
  padding: 1px 5px;
`;

const LevelOption = styled.option``;

const EmptyText = styled.p`
  margin: auto auto;
`;
