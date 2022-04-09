import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CustomLevelType } from './Game/Game';

enum CellStatus {
  Opened = 'OPENED',
  Closed = 'CLOSED',
  Bomb = 'BOMB',
}

type BoardType = string[][];

type Props = {
  cellInfoNumbers: CustomLevelType;
};

const Board = ({ cellInfoNumbers }: Props) => {
  const { row, column, bomb } = cellInfoNumbers;
  const [boradArray, setBoardArray] = useState<BoardType>();

  useEffect(() => {
    console.log('[Board/useEffect] cellInfoNumbers', { row, column, bomb });
    generateBoard(column, row);
  }, [bomb, column, row]);

  //1. generate base board array at start
  const generateBoard = (row: number, column: number) => {
    const resultArray: BoardType = [];

    for (let i = 0; i < row; i++) {
      resultArray.push([]);
      for (let j = 0; j < column; j++) {
        resultArray[i][j] = CellStatus.Opened;
      }
    }

    setBoardArray(resultArray);
  };

  return (
    <BoardWrapper>
      <BoardBox>
        {boradArray?.map((row, index) => (
          <BoardTableRow key={index}>
            {row.map((item, index) => {
              return <BoardTableData />;
            })}
          </BoardTableRow>
        ))}
      </BoardBox>
    </BoardWrapper>
  );
};

export default Board;

const BoardWrapper = styled.table`
  padding: 5px;
`;

const BoardBox = styled.tbody``;

const BoardTableRow = styled.tr``;

const BoardTableData = styled.td`
  width: 1rem;
  height: 1rem;
  background-color: ${(props) => props.theme.colors.main};
`;
