import React from 'react';
import styled from 'styled-components';

type Props = {};

const Board = (props: Props) => {
  return (
    <BoardWrapper>
      <BoardBox>Board</BoardBox>
    </BoardWrapper>
  );
};

export default Board;

const BoardWrapper = styled.table``;

const BoardBox = styled.tbody``;
