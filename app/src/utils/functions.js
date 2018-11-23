// @flow

export default function chain(...fns: Array<() => void>): (() => void) {
  return (...args) => {
    fns.forEach((fn: (() => void)): void => fn(...args));
  };
}
