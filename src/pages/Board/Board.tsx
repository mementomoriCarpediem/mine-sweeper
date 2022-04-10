import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../../store/config';

enum CellStatus {
  Opened = 'OPENED',
  Closed = 'CLOSED',
  Bomb = 'BOMB',
  Bomb1 = '1',
  Bomb2 = '2',
  Bomb3 = '3',
  Bomb4 = '4',
  Bomb5 = '5',
  Bomb6 = '6',
  Bomb7 = '7',
  Bomb8 = '8',
}

type BoardType = CellStatus[][];

const ADJACENT_CELLS_RELATIVE_LOCATIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

type Props = {
  isGameStart: boolean;
  setIsGameStart: Dispatch<SetStateAction<boolean>>;
  isGameOver: boolean;
  setIsGameOver: Dispatch<SetStateAction<boolean>>;
};

const Board = ({
  isGameStart,
  setIsGameStart,
  isGameOver,
  setIsGameOver,
}: Props) => {
  const { settings } = useAppSelector((state) => state.game);
  const { row, column, bomb } = settings;

  const [boradArray, setBoardArray] = useState<BoardType>([]);

  const [isFirstTry, setIsFirstTry] = useState<boolean>(true);

  // const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    console.log('[Board/useEffect] cellInfoNumbers', { row, column, bomb });
  }, [bomb, column, row]);

  useEffect(() => {
    console.log('[Board/useEffect] boradArray', boradArray);
  }, [boradArray]);

  const generateBoard = (row: number, column: number) => {
    //2. generate base board array at start
    const resultArray: BoardType = [];

    for (let i = 0; i < row; i++) {
      resultArray.push([]);
      for (let j = 0; j < column; j++) {
        resultArray[i][j] = CellStatus.Closed;
      }
    }

    //3. set mines to ramdom cell
    const boardArrayWithMinesSet = setMines(resultArray, bomb, row, column);

    return boardArrayWithMinesSet;
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
      return [];
    }
  };

  useEffect(() => {
    //1. if user click "start" button, genearteBoard
    isGameStart && setBoardArray(generateBoard(column, row));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bomb, column, isGameStart, row]);

  /* 
  4. on click each cell, cell is open 
   : if there is no mine, show mine number or open till mine is detected,
   : if cell with mine is clicked, game over
  */
  const onClickBoardCell = (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    { rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }
  ) => {
    console.log('[Board/onClickBoradCell] row and column index', {
      rowIndex,
      columnIndex,
    });

    let resultArray = [...boradArray];

    // if it is frist try, bomb is never exploded
    if (resultArray[rowIndex][columnIndex] === CellStatus.Bomb && !isFirstTry) {
      setIsGameOver(true);
      window.alert('Game Over');
      return;
    } else if (
      resultArray[rowIndex][columnIndex] === CellStatus.Bomb &&
      isFirstTry
    ) {
      setIsFirstTry(false);
      const newArrayToAvoidFirstMine = [...resultArray];

      newArrayToAvoidFirstMine[rowIndex][columnIndex] = CellStatus.Closed;

      const convertedRowIndex =
        rowIndex + 1 > row ? rowIndex - 1 : rowIndex + 1;

      newArrayToAvoidFirstMine[convertedRowIndex][columnIndex] =
        CellStatus.Bomb;

      resultArray = newArrayToAvoidFirstMine;
    }

    setIsFirstTry(false);

    // if cell is clicked and cell changed to opened, adjecent cells are open automatically till mine is detected
    const mineNumberDetected = checkAdjacentCells(rowIndex, columnIndex);

    console.log(1, mineNumberDetected);

    if (mineNumberDetected > 0) {
      const newArrayWithMineNumberSet = setMineNumberToCell(
        mineNumberDetected,
        rowIndex,
        columnIndex
      );

      resultArray = newArrayWithMineNumberSet
        ? newArrayWithMineNumberSet
        : resultArray;

      console.log(2, resultArray);
    } else if (mineNumberDetected === 0) {
      console.log(3, mineNumberDetected);

      resultArray[rowIndex][columnIndex] = CellStatus.Opened;

      openCellsWithOutMines(rowIndex - 1, columnIndex);
      openCellsWithOutMines(rowIndex + 1, columnIndex);
      openCellsWithOutMines(rowIndex, columnIndex - 1);
      openCellsWithOutMines(rowIndex, columnIndex + 1);
    }

    setBoardArray(resultArray);
  };

  // check 8cells around selected cell
  const checkAdjacentCells = (rowIndex: number, colIndex: number) => {
    let detectedMinesNumber: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 = 0;

    ADJACENT_CELLS_RELATIVE_LOCATIONS.map((item, index) => {
      if (
        rowIndex + item[0] < 0 ||
        colIndex + item[1] < 0 ||
        rowIndex + item[0] + 1 > row ||
        colIndex + item[1] + 1 > column
      ) {
        // console.log('[Board/checkAdjacentCells] this location is not exist');
      } else {
        if (
          boradArray[rowIndex + item[0]][colIndex + item[1]] === CellStatus.Bomb
        ) {
          detectedMinesNumber++;
        }
      }
    });

    return detectedMinesNumber;
  };

  // open cell without mines
  const openCellsWithOutMines = (rowIndex: number, colIndex: number) => {
    if (
      rowIndex < 0 ||
      colIndex < 0 ||
      rowIndex + 1 > row ||
      colIndex + 1 > column ||
      boradArray[rowIndex][colIndex] === CellStatus.Opened
    )
      return;

    const mineNumberDetected = checkAdjacentCells(rowIndex, colIndex);

    if (mineNumberDetected > 0) {
      const newArrayWithMineNumberSet = setMineNumberToCell(
        mineNumberDetected,
        rowIndex,
        colIndex
      );
      newArrayWithMineNumberSet && setBoardArray(newArrayWithMineNumberSet);
    } else if (mineNumberDetected === 0) {
      const resultArray = [...boradArray];
      resultArray[rowIndex][colIndex] = CellStatus.Opened;
      setBoardArray(resultArray);

      openCellsWithOutMines(rowIndex - 1, colIndex);
      openCellsWithOutMines(rowIndex + 1, colIndex);
      openCellsWithOutMines(rowIndex, colIndex - 1);
      openCellsWithOutMines(rowIndex, colIndex + 1);
    }
  };

  const setMineNumberToCell = (
    mineNumberDetected: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
    rowIndex: number,
    columnIndex: number
  ) => {
    const resultArray = [...boradArray];

    switch (mineNumberDetected) {
      case 1:
        resultArray[rowIndex][columnIndex] = CellStatus.Bomb1;
        return resultArray;
      case 2:
        resultArray[rowIndex][columnIndex] = CellStatus.Bomb2;
        return resultArray;
      case 3:
        resultArray[rowIndex][columnIndex] = CellStatus.Bomb3;
        return resultArray;
      case 4:
        resultArray[rowIndex][columnIndex] = CellStatus.Bomb4;
        return resultArray;
      case 5:
        resultArray[rowIndex][columnIndex] = CellStatus.Bomb5;
        return resultArray;
      case 6:
        resultArray[rowIndex][columnIndex] = CellStatus.Bomb6;
        return resultArray;
      case 7:
        resultArray[rowIndex][columnIndex] = CellStatus.Bomb7;
        return resultArray;
      case 8:
        resultArray[rowIndex][columnIndex] = CellStatus.Bomb8;
        return resultArray;
      default:
        console.log('[Board/setMineNumberToCell] mineNumber is not set');
        break;
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
                >
                  {item !== CellStatus.Opened &&
                    item !== CellStatus.Closed &&
                    item !== CellStatus.Bomb &&
                    item}
                  {item === CellStatus.Bomb && isGameOver && `💣`}
                </BoardTableData>
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
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 3px;
  text-align: center;
  background-color: ${(props) =>
    props.status === CellStatus.Opened
      ? props.theme.colors.sub2
      : props.theme.colors.main};
`;
