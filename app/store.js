// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as reduxPackMiddleware } from 'redux-pack';
import { composeWithDevTools } from 'remote-redux-devtools';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from 'reducers';

const initialState = {};
const enhancers = [];
let middleware = [
  thunk,
  reduxPackMiddleware,
];

if (__DEV__) {
  middleware = [...middleware, createLogger()];
}

const composedEnhancers = composeWithDevTools(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(rootReducer, composedEnhancers);
export default store;
