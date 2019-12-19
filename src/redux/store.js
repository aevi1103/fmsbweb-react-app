import { createStore, applyMiddleware } from 'redux';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import thunk from 'redux-thunk';
import rootReducer from './root-reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
    key: 'root',
    storage,
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