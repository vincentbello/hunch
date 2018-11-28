// @flow

export function chain(...fns: Array<() => void>): (() => void) {
  return (...args) => {
    fns.forEach((fn: (() => void)): void => fn(...args));
  };
}

export function noop() {}
