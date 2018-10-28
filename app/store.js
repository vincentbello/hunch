// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'remote-redux-devtools';
// import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import authMiddleware from 'middleware/auth';
import rootReducer from 'reducers';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['session'],
};
const initialState = {};
const enhancers = [];
let middleware = [
  thunk,
  authMiddleware,
  reduxPackMiddleware,
];

// if (__DEV__) {
//   middleware = [...middleware, createLogger()];
// }

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composedEnhancers = composeWithDevTools(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(persistedReducer, composedEnhancers);

export const persistor = persistStore(store);
export default store;
