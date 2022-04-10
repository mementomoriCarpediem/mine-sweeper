import { ThemeProvider } from 'styled-components';
import { theme } from './themes/theme';

import Game from './pages/Game/Game';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Game />
    </ThemeProvider>
  );
}

export default App;
