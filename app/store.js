// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'remote-redux-devtools';
import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';
import rootReducer from 'reducers';

const persistConfig = {
  key: 'root',
  storage,
};
const initialState = {};
const enhancers = [];
let middleware = [
  thunk,
  reduxPackMiddleware,
];

if (__DEV__) {
  middleware = [...middleware, createLogger()];
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composedEnhancers = composeWithDevTools(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(rootReducer, composedEnhancers);
export default store;
