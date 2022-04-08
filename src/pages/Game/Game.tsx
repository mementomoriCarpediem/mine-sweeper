import React from 'react';
import styled from 'styled-components';
import Board from '../Board';

type Props = {};

const Game = (props: Props) => {
  return (
    <GameContainer>
      <HeaderContainer>
        <SubBox>
          <TitleText>지뢰갯수</TitleText>
          <MineDisplay>10 개</MineDisplay>
        </SubBox>
        <SubBox style={{ width: '100%' }}>
          <LevelSelection>
            <LevelOption value="">난이도 선택</LevelOption>
            <LevelOption value="Beginner">Beginner</LevelOption>
            <LevelOption value="Intermediate">Intermediate</LevelOption>
            <LevelOption value="Expert">Expert</LevelOption>
          </LevelSelection>
          <SettingContainer>
            <SettingInputLabel>
              가로 수
              <SettingInput type="number" />
            </SettingInputLabel>
            <SettingInputLabel>
              세로 수
              <SettingInput type="number" />
            </SettingInputLabel>
            <SettingInputLabel>
              폭탄 수
              <SettingInput type="number" />
            </SettingInputLabel>
          </SettingContainer>
          <ButtonGroup>
            <StartButton>Start</StartButton>
            <ResetButton>Reset</ResetButton>
          </ButtonGroup>
        </SubBox>
        <SubBox>
          <TitleText>소요시간</TitleText>
          <TimeDisplay> 1 초</TimeDisplay>
        </SubBox>
      </HeaderContainer>
      <Board />
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
  width: 2rem;
  height: 1rem;
  margin-left: 1rem;
`;

const SettingInputLabel = styled.label``;

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
  width: 10rem;
  background-color: blue;
`;

const LevelSelection = styled.select`
  width: 9rem;
  font-size: 1rem;
  font-weight: 500;
  padding: 1px 5px;
`;

const LevelOption = styled.option``;
