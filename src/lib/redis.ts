import { env } from '@/env'
import { createClient } from 'redis'

export const redis = createClient({
  url: env.REDIS_DB_URL,
})

redis.connect()