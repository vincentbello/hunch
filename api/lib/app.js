import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import { ApolloServer } from 'apollo-server-express';

import authMiddleware from './middleware/auth';
import setupPassport from './services/passport';
import schema from './schema';
import { formatResponse, formatError } from './utils/apollo/formatter';

import indexRouter from './routes/index';

setupPassport();

const app = express();
const GRAPHQL_PATH = '/api';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Use cors
app.use(cors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token', 'r-auth-token'],
}));

app.use('/', indexRouter);

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res, userId: req.auth ? req.auth.id : null, user: req.user }),
  engine: { apiKey: process.env.ENGINE_API_KEY },
  formatResponse,
  formatError,
});
app.use(GRAPHQL_PATH, authMiddleware);
apolloServer.applyMiddleware({ app, path: GRAPHQL_PATH });

export default app;
