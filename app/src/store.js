// @flow
import { createStore } from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import rootReducer from 'reducers';

export default createStore(rootReducer, devToolsEnhancer());
