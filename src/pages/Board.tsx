import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CustomLevelType } from './Game/Game';

enum CellStatus {
  Opened = 'OPENED',
  Closed = 'CLOSED',
  Bomb = 'BOMB',
}

type BoardType = CellStatus[][];

type Props = {
  cellInfoNumbers: CustomLevelType;
  isGameStart: boolean;
  setIsGameStart: Dispatch<SetStateAction<boolean>>;
};

const Board = ({ cellInfoNumbers, isGameStart, setIsGameStart }: Props) => {
  const { row, column, bomb } = cellInfoNumbers;
  const [boradArray, setBoardArray] = useState<BoardType>();

  useEffect(() => {
    console.log('[Board/useEffect] cellInfoNumbers', { row, column, bomb });
  }, [bomb, column, row]);

  useEffect(() => {
    console.log('[Board/useEffect] boradArray', boradArray);
  }, [boradArray]);

  const generateBoard = async (row: number, column: number) => {
    //1. generate base board array at start
    const resultArray: BoardType = [];

    for (let i = 0; i < row; i++) {
      resultArray.push([]);
      for (let j = 0; j < column; j++) {
        resultArray[i][j] = CellStatus.Closed;
      }
    }

    //2. set mines to ramdom cell
    const boardArrayWithMinesSet = setMines(resultArray, bomb, row, column);

    setBoardArray(boardArrayWithMinesSet);
  };

  const setMines = (
    boardArray: BoardType,
    bomb: number,
    row: number,
    column: number
  ) => {
    const resultArray: BoardType = [...boardArray];

    if (bomb <= (row + 1) * (column + 1)) {
      let plantedMines = 0;

      while (plantedMines < bomb) {
        const randomRowNumber = Math.floor(Math.random() * row);
        const randomColumnNumber = Math.floor(Math.random() * column);

        if (
          resultArray[randomRowNumber][randomColumnNumber] !== CellStatus.Bomb
        ) {
          resultArray[randomRowNumber][randomColumnNumber] = CellStatus.Bomb;
          plantedMines++;
        }
      }
      return resultArray;
    } else {
      window.alert(
        '전체 칸 수를 초과하는 지뢰 수를 입력하셨습니다. 다시 시작해주세요'
      );
      return;
    }
  };

  useEffect(() => {
    isGameStart && generateBoard(column, row);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bomb, column, isGameStart, row]);

  // 3. on click cell, cell is open (if there is no mine, show mine number or open till mine is detected),
  // game over(if there is mine)
  const onClickBoardCell = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    { rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }
  ) => {
    console.log('[Board/onClickBoradCell] row and column index', {
      rowIndex,
      columnIndex,
    });

    if (boradArray) {
      const resultArray = [...boradArray];

      for (let i = 0; i < boradArray.length; i++) {
        for (let j = 0; j < boradArray[0].length; j++) {
          if (i === rowIndex && j === columnIndex) {
            if (resultArray[i][j] === CellStatus.Closed) {
              resultArray[i][j] = CellStatus.Opened;
            }
          }
        }
      }
      // console.log('check here ==>', resultArray);

      setBoardArray(resultArray);
    } else {
      console.error('[Board/onClickBoradCell] Error: board is not set yet');
    }
  };

  return (
    <BoardWrapper>
      <BoardBox>
        {boradArray?.map((row, index1) => (
          <BoardTableRow key={index1}>
            {row.map((item, index2) => {
              return (
                <BoardTableData
                  key={index2}
                  onClick={(e) =>
                    onClickBoardCell(e, {
                      rowIndex: index1,
                      columnIndex: index2,
                    })
                  }
                  status={item}
                />
              );
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
  margin: auto auto;
`;

const BoardBox = styled.tbody``;

const BoardTableRow = styled.tr``;

const BoardTableData = styled.td<{ status: CellStatus }>`
  width: 1rem;
  height: 1rem;
  border-radius: 3px;
  background-color: ${(props) =>
    props.status === CellStatus.Opened
      ? props.theme.colors.sub2
      : props.theme.colors.main};
`;
