import styled from 'styled-components';
import { CellStatus } from './Board';

const BoardWrapper = styled.table`
  padding: 5px;
  margin: auto auto;
`;

const BoardBox = styled.tbody``;

const BoardTableRow = styled.tr``;

const BoardTableData = styled.td<{ status: CellStatus }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 3px;
  text-align: center;
  background-color: ${(props) =>
    props.status === CellStatus.Opened
      ? props.theme.colors.sub2
      : props.theme.colors.main};
`;

interface BoardMainProps {
  children: React.ReactChildren;
}

const BoardMain = ({ children, ...rest }: BoardMainProps) => (
  <BoardWrapper {...rest}>{children}</BoardWrapper>
);

BoardMain.BoardWrapper = BoardWrapper;
BoardMain.BoardBox = BoardBox;
BoardMain.BoardTableRow = BoardTableRow;
BoardMain.BoardTableData = BoardTableData;

export default BoardMain;
