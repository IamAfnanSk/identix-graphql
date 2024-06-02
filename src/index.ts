import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Redis } from 'ioredis';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';

// Project files
import { redis, prisma } from './constants/dataClients.js';
import { schema } from './handlers/index.js';
import { JWT_ACCESS_SECRET_KEY, PORT } from './constants/global.js';
import { getDecodedJWT } from './utils/getDecodedJWT.js';

export interface CustomApolloContext {
  prisma: PrismaClient;
  redis: Redis;
  userId: string | null;
  req?: express.Request;
  res?: express.Response;
}

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer<CustomApolloContext>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>({
    origin: ['https://sandbox.embed.apollographql.com'],
    credentials: true,
  }),
  bodyParser.json(),
  cookieParser(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const token: string = req.headers.authorization?.split(' ')[1] || '';
      const decodedJWT = getDecodedJWT(token, JWT_ACCESS_SECRET_KEY);

      return { prisma, redis, userId: decodedJWT.id || null, req, res };
    },
  }),
);

await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
