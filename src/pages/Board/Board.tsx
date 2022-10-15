import React, { useCallback, useEffect, useState } from 'react';
import { ADJACENT_CELLS_RELATIVE_LOCATIONS } from '../../constants';

import { useAppSelector } from '../../store/config';

import BoardContainer from './BoardContainer';

export enum CellStatus {
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
type PickKey<T, K extends keyof T> = Extract<keyof T, K>;
type PickedCellStatus = PickKey<
  typeof CellStatus,
  'Bomb1' | 'Bomb2' | 'Bomb3' | 'Bomb4' | 'Bomb5' | 'Bomb6' | 'Bomb7' | 'Bomb8'
>;

export type BoardType = CellStatus[][];

type BoardProps = {
  isGameOver: boolean;
  setIsGameOver: (value: boolean) => void;
};

const Board = ({ isGameOver, setIsGameOver }: BoardProps) => {
  const { settings } = useAppSelector((state) => state.game);
  const { row, column, bomb } = settings;

  const [boradArray, setBoardArray] = useState<BoardType>([]);
  const [isFirstTry, setIsFirstTry] = useState<boolean>(true);

  // useEffect(() => {
  //   console.log('[Board/useEffect] cellInfoNumbers', { row, column, bomb });
  // }, [bomb, column, row]);

  // useEffect(() => {
  //   console.log('[Board/useEffect] boradArray', boradArray);
  // }, [boradArray]);

  //2. generate base board array at start
  const generateBoard = async (
    horizontalNumber: number,
    verticalNumber: number
  ) => {
    const baseArray: BoardType = [];

    for (let i = 0; i < verticalNumber; i++) {
      baseArray.push([]);
      for (let j = 0; j < horizontalNumber; j++) {
        baseArray[i][j] = CellStatus.Closed;
      }
    }

    return baseArray;
  };

  //3. set mines to ramdom cell
  const setMines = useCallback(
    (boardArrayWithoutMines: BoardType) => {
      const resultArray: BoardType = [...boardArrayWithoutMines];

      if (bomb <= row * column) {
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
    },
    [bomb, column, row]
  );

  useEffect(() => {
    //1. if user click "start" button, genearteBoard
    if (!isGameOver)
      generateBoard(column, row).then((res) => setBoardArray(setMines(res)));
  }, [column, isGameOver, row, setMines]);

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

    if (mineNumberDetected > 0) {
      const newArrayWithMineNumberSet = setMineNumberToCell(
        mineNumberDetected,
        rowIndex,
        columnIndex
      );

      resultArray = newArrayWithMineNumberSet
        ? newArrayWithMineNumberSet
        : resultArray;
    } else if (mineNumberDetected === 0) {
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

    ADJACENT_CELLS_RELATIVE_LOCATIONS.forEach((item, index) => {
      if (
        !(
          rowIndex + item[0] < 0 ||
          colIndex + item[1] < 0 ||
          rowIndex + item[0] + 1 > row ||
          colIndex + item[1] + 1 > column
        ) &&
        boradArray[rowIndex + item[0]][colIndex + item[1]] === CellStatus.Bomb
      )
        detectedMinesNumber++;
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

    const BombNumber: PickedCellStatus = `Bomb${
      mineNumberDetected + 1
    }` as PickedCellStatus;

    resultArray[rowIndex][columnIndex] = CellStatus[BombNumber];

    return resultArray;
  };

  // check if user win
  const checkIsGameSuccess = useCallback(() => {
    const cellsWithMines = [];
    const closedCells = [];

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        if (boradArray[i][j] === CellStatus.Bomb) {
          cellsWithMines.push(`${i}:${j}`);
        } else if (boradArray[i][j] === CellStatus.Closed) {
          closedCells.push(`${i}:${j}`);
        }
      }
    }

    return closedCells.length === 0 && cellsWithMines.length === bomb
      ? true
      : false;
  }, [bomb, boradArray, column, row]);

  useEffect(() => {
    if (boradArray.length > 0 && checkIsGameSuccess()) {
      window.alert('YOU WIN');
      setIsGameOver(true);
    }
  }, [boradArray, checkIsGameSuccess, setIsGameOver]);

  return (
    <BoardContainer
      boradArray={boradArray}
      isGameOver={isGameOver}
      onClickBoardCell={onClickBoardCell}
    />
  );
};

export default Board;
