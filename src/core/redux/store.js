import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import localforage from 'localforage';
import thunk from 'redux-thunk';
import rootReducer from './root-reducer';
import { version } from '../../../package.json'

const persistConfig = {
    key: `root_${version}`,
    storage: localforage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }).concat(thunk)
})

const persistor = persistStore(store);

export { store, persistor };