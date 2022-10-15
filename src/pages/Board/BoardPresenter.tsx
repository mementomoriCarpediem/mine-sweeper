import React from 'react';

import BoardMain from './Board.style';
import { BoardType, CellStatus } from './BoardContainer';

type Props = {
  boradArray: BoardType;
  isGameOver: boolean;
  onClickBoardCell: (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    { rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }
  ) => void;
};

const BoardPresenter = ({
  boradArray,
  isGameOver,
  onClickBoardCell,
}: Props) => {
  return (
    <BoardMain.BoardWrapper>
      <BoardMain.BoardBox>
        {boradArray.length > 0 &&
          boradArray.map((row, index1) => (
            <BoardMain.BoardTableRow key={index1}>
              {row.map((item, index2) => {
                return (
                  <BoardMain.BoardTableData
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
                  </BoardMain.BoardTableData>
                );
              })}
            </BoardMain.BoardTableRow>
          ))}
      </BoardMain.BoardBox>
    </BoardMain.BoardWrapper>
  );
};

export default BoardPresenter;
