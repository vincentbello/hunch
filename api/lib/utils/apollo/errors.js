import { createError } from 'apollo-errors';

export const AuthenticationError = createError('AuthenticationError', {
  message: 'An authentication error occurred.',
});

export const ForbiddenError = createError('ForbiddenError', {
  message: 'A forbidden error occurred.',
});
