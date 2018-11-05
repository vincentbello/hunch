import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import { ApolloServer } from 'apollo-server-express';

import authMiddleware from './middleware/auth';
import setupPassport from './utils/passport';
import schema from './schema';
import UserSerializer from './serialization/User';

import indexRouter from './routes/index';
import authRouter from './routes/auth';

setupPassport();

const app = express();
const GRAPHQL_PATH = '/graphql';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// Use cors
app.use(cors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', 'r-auth-token'],
}));

app.use('/', indexRouter);
app.use('/auth', authRouter);

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ userId: req.auth.id }),
});
app.use(GRAPHQL_PATH, authMiddleware);
apolloServer.applyMiddleware({ app, path: GRAPHQL_PATH });

export default app;
