import React from 'react';

import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider as ReduxProvider } from 'react-redux';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = createRoot(container as Element);

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
