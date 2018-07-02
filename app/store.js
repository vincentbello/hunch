// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import { middleware as reduxPackMiddleware } from 'redux-pack';
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

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(rootReducer, initialState, composedEnhancers);
export default store;
