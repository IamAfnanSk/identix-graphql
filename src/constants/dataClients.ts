import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import mockRedis from 'ioredis-mock';
import { IS_TESTING } from './global.js';

const redisClient: Redis = IS_TESTING ? new mockRedis() : new Redis();
const prismaClient = new PrismaClient();

redisClient.on('connect', () => {
  console.log('Client connected to redis..');
});

redisClient.on('ready', () => {
  console.log('Redis client is redy to use');
});

redisClient.on('error', (err) => {
  console.log(err.message);
});

process.on('SIGINT', async () => {
  redisClient.disconnect();
  console.log('redis disconnected');
  await prismaClient.$disconnect();
  console.log('Prisma connection closed.');
});

process.on('exit', async () => {
  redisClient.disconnect();
  console.log('redis disconnected');
  await prismaClient.$disconnect();
  console.log('Prisma connection closed.');
});

export { redisClient as redis, prismaClient as prisma };
