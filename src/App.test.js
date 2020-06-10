import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor} from './redux/store';

import './index.css';
import App from './App';


import 'tachyons'
import './sass/main.scss'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BrowserRouter>
                      <PersistGate loading={null} persistor={persistor}>
                          <Provider store={store}>
                              <App />
                          </Provider>
                      </PersistGate>
                  </BrowserRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
