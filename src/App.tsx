import React from 'react';
import { Counter } from './features/counter/Counter';

import { ThemeProvider } from 'styled-components';
import { theme } from './themes/theme';
import Game from './pages/Game/Game';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <Counter /> */}
      <Game />
    </ThemeProvider>
  );
}

export default App;
