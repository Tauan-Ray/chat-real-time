import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private redisClient: Redis,
  ) {}

  async set(key: string, value: any) {
    const stringValue = JSON.stringify(value);
    await this.redisClient.set(key, stringValue);
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }
}
