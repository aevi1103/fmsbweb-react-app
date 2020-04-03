import { createStore, applyMiddleware } from 'redux';

import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import localforage from 'localforage';

import thunk from 'redux-thunk';
import rootReducer from './root-reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

import { version } from '../../package.json'

const persistConfig = {
    key: `root_${version}`,
    storage: localforage,
  }

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares = [
    thunk
];

const store = createStore(
    persistedReducer,
    composeWithDevTools(
        applyMiddleware(...middlewares)
    )
)

const persistor = persistStore(store);

export { store, persistor };