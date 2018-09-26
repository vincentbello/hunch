import expressJwt from 'express-jwt';

export default expressJwt({
  secret: process.env.ACCESS_TOKEN_KEY,
  requestProperty: 'auth',
  getToken: req => req.headers['x-auth-token'] || null,
});
