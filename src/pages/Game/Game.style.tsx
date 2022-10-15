import styled from 'styled-components';
import { LevelType } from '../../store/slices/gameSlices';

const GameContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  min-height: 400px;
  margin: auto;
  margin-top: 5rem;
  border: 2px solid black;
  border-radius: 5px;
`;

const Header = styled.section`
  display: flex;
  justify-content: space-around;
  width: 100%;
  background-color: ${(props) => props.theme.colors.main};
  border-bottom: 2px solid black;
`;

const Setting = styled.section`
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

const StartResetButton = styled.button<{ isStart: boolean }>`
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 15px;
  margin-left: 1rem;
  border-width: 0;
  width: 5rem;
  border-radius: ${(props) => props.theme.borderRadius};
  color: white;
  background-color: ${(props) => (props.isStart ? 'blue' : 'salmon')};
`;

const LevelSelection = styled.select`
  width: 9rem;
  font-size: 1rem;
  font-weight: 500;
  padding: 1px 5px;
`;

const LevelOption = styled.option<{ value?: LevelType }>``;

const EmptyText = styled.p`
  margin: auto auto;
`;

interface GameMainProps {
  children: any;
}

const GameMain = ({ children, ...rest }: GameMainProps) => (
  <GameContainer {...rest}>{children}</GameContainer>
);

GameMain.GameContainer = GameContainer;
GameMain.Header = Header;
GameMain.Setting = Setting;
GameMain.SettingInput = SettingInput;
GameMain.SettingInputLabel = SettingInputLabel;
GameMain.SubBox = SubBox;
GameMain.TitleText = TitleText;
GameMain.TimeDisplay = TimeDisplay;
GameMain.MineDisplay = MineDisplay;
GameMain.ButtonGroup = ButtonGroup;

GameMain.StartResetButton = StartResetButton;
GameMain.LevelSelection = LevelSelection;
GameMain.LevelOption = LevelOption;
GameMain.EmptyText = EmptyText;

export default GameMain;
