// @flow
import { handle } from 'redux-pack';
import dotProp from 'dot-prop-immutable';
import { type Action } from 'types/redux';

/**
 * The default substate/data/error properties to be stored for a given promise
 */
export const initialPromiseState = {
  data: null,
  didFetch: false,
  error: null,
  meta: null,
  hasError: false,
  isLoading: false,
};

type Payload = {
  data: *,
};

type State = {
  [key: string]: *,
};

type PromiseHandlingConfig = {
  cacheData?: boolean,
  rootPath?: string,
  dataPath?: string,
  handleSuccess?: null | (prevState: State, payload: Payload) => State,
  meta?: * | null,
  mapPayloadToData?: (payload: Payload) => *,
  parseData?: (data: *, state: State) => *,
};

const defaultPromiseHandlingConfig = {
  cacheData: false,
  rootPath: null,
  dataPath: 'data',
  handleSuccess: null,
  meta: null,
  mapPayloadToData: (payload: Payload): * => payload.data,
  parseData: (data: *, _: State): * => data,
};

/**
 * Transform function to store promise start substates
 */
const startTransform = (state: State, config: PromiseHandlingConfig): State => ({
  ...state,
  ...(config.cacheData && dotProp.get(state, config.dataPath) != null ? {} : initialPromiseState),
  isLoading: true,
  didFetch: true,
  meta: config.meta,
});

/**
 * Transform function to store promise finish substates
 */
const finishTransform = (state: State): State => ({ ...state, isLoading: false });

/**
 * Wrapper util around redux-pack's "handle" method to store predictable substate/data values into the store.
 * Options include:
 *  - rootPath         {string}   The path, in dotProp notation (i.e. 'foo.bar.baz'), in which substate/data values should be stored
 *  - dataPath         {string}   The path, in addition to rootPath, in which successfully fetched data should be stored
 *  - mapPayloadToData {Function} The function to apply to the payload on success to extract data
 *  - parseData        {Function} The function to apply to the extracted data before storing it in the store
 */
export default function handlePromise(state: State, action: Action, options: PromiseHandlingConfig = {}): State {
  const config = { ...defaultPromiseHandlingConfig, ...options };
  const { rootPath, dataPath, handleSuccess, mapPayloadToData, parseData } = config;

  return handle(state, action, {
    start: (prevState: State): State => (rootPath ? dotProp.set(prevState, rootPath, (prevState) => startTransform(prevState, config)) :
      startTransform(prevState, config)),
    finish: (prevState: State): State => (rootPath ? dotProp.set(prevState, rootPath, finishTransform) : finishTransform(prevState)),
    success: (prevState: State): State => {
      if (handleSuccess) return handleSuccess(state, action.payload);
      const parsedData = parseData(mapPayloadToData(action.payload), prevState);
      const fullPath = rootPath ? `${rootPath}.${dataPath}` : dataPath;
      return dotProp.set(prevState, fullPath, parsedData);
    },
    failure: (prevState: State): State => {
      const newSubstates = { hasError: true, error: 'An error occurred!' };
      return rootPath ? dotProp.set(prevState, rootPath, v => ({ ...v, ...newSubstates })) : { ...prevState, ...newSubstates };
    },
  });
}
