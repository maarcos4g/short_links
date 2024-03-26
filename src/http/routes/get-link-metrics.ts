import { redis } from "@/lib/redis";
import { FastifyInstance } from "fastify";

export async function getLinkMetrics(app: FastifyInstance) {
  app.get('/api/metrics', async () => {
    const result = await redis.zRangeByScoreWithScores('metrics', 0, 50)

    const metrics = result.sort((a, b) => b.score - a.score).map(item => {
      return {
        shortLinkId: Number(item.value),
        clicks: item.score,
      }
    })

    return metrics
  })
}