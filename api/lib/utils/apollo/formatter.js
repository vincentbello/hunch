import { isInstance as isApolloErrorInstance, formatError as formatApolloError } from 'apollo-errors';

const getLogItems = ({ operationName, variables }) => {
  if (!variables || Object.keys(variables).length === 0) return [operationName];
  return [`${operationName}:`, JSON.stringify(variables)];
};

export function formatResponse(_res, req) {
  console.info(...getLogItems(req));
  return req;
}

export function formatError(err) {
  const { originalError } = err;
  if (isApolloErrorInstance(originalError)) {
    console.log(JSON.stringify({
      type: 'error',
      data: originalError.data,
      internalData: originalError.internalData,
    }));
  }
  return formatApolloError(err);
}
