import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Board from '../Board';

type LevelType = 'Beginner' | 'Intermediate' | 'Expert';
export type CustomLevelType = { row: number; column: number; bomb: number };

type Props = {};

const Game = (props: Props) => {
  const [level, setLevel] = useState<LevelType | ''>('');
  const [customLevelInputs, setCustomLevelInputs] = useState<CustomLevelType>({
    row: 0,
    column: 0,
    bomb: 0,
  });

  const { row, column, bomb } = customLevelInputs;

  const isEmpty = useMemo(() => row === 0 || column === 0, [column, row]);

  const inputNameArray = [
    { name: 'row', text: '가로 길이', number: row },
    { name: 'column', text: '세로 길이', number: column },
    { name: 'bomb', text: '지뢰 수', number: bomb },
  ];

  const onChangeLevelInput = (e: ChangeEvent<HTMLSelectElement>) => {
    setLevel(e.target.value as LevelType);
  };

  const onChangeCustomLevelInputs = (
    e: ChangeEvent<HTMLInputElement> & {
      target: { name: keyof CustomLevelType; value: number };
    }
  ) => {
    const { name, value } = e.target;

    const dummyObject = { ...customLevelInputs };
    dummyObject[name] = Number(value);

    setCustomLevelInputs(dummyObject);
  };

  //change setting level inputs by level selection
  useEffect(() => {
    switch (level) {
      case 'Beginner':
        setCustomLevelInputs({
          row: 8,
          column: 8,
          bomb: customLevelInputs.bomb,
        });
        break;
      case 'Intermediate':
        setCustomLevelInputs({
          row: 16,
          column: 16,
          bomb: customLevelInputs.bomb,
        });
        break;
      case 'Expert':
        setCustomLevelInputs({
          row: 32,
          column: 16,
          bomb: customLevelInputs.bomb,
        });
        break;

      default:
        console.log('[Game/useEffect] custom settting..');
        break;
    }
  }, [customLevelInputs.bomb, level]);

  return (
    <GameContainer>
      <HeaderContainer>
        <SubBox>
          <TitleText>지뢰갯수</TitleText>
          <MineDisplay>10 개</MineDisplay>
        </SubBox>
        <SubBox style={{ width: '100%' }}>
          <LevelSelection onChange={(e) => onChangeLevelInput(e)}>
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
            <StartButton>Start</StartButton>
            <ResetButton onClick={resetGame}>Reset</ResetButton>
          </ButtonGroup>
        </SubBox>
        <SubBox>
          <TitleText>소요시간</TitleText>
          <TimeDisplay> 1 초</TimeDisplay>
        </SubBox>
      </HeaderContainer>

      <Board cellInfoNumbers={customLevelInputs} />
      {isEmpty && <EmptyText>게임 설정 값을 입력해주세요.</EmptyText>}
    </GameContainer>
  );
};

export default Game;

const GameContainer = styled.main`
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  align-items: center;
  width: 50%;
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
  background-color: salmon;
  border-radius: ${(props) => props.theme.borderRadius};
`;

const StartButton = styled(ResetButton)`
  color: white;
  width: 7rem;
  background-color: blue;
`;

const LevelSelection = styled.select`
  width: 9rem;
  font-size: 1rem;
  font-weight: 500;
  padding: 1px 5px;
`;

const LevelOption = styled.option``;

const EmptyText = styled.p``;
