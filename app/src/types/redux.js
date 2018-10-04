// @flow
export type Action = {
  type: string,
  [key: string]: any,
};

export type Error = {
  message: string,
  meta: null | *,
};

export type PromiseState<T = null> = {
  didFetch: boolean,
  error: null | Error,
  meta: null | *,
  hasError: boolean,
  isLoading: boolean,
  data: null | T,
};
