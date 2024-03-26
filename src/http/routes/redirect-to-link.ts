import { sql } from "@/lib/postgres";
import { redis } from "@/lib/redis";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function redirectToLink(app: FastifyInstance) {
  app.get('/:code', async ({ params }, reply) => {
    const getLinkSchema = z.object({
      code: z.string().min(3)
    })
  
    const { code } = getLinkSchema.parse(params);
  
    const result = await sql/*sql*/`
    SELECT id, original_url
    FROM short_links
    WHERE short_links.code = ${code}
    `
  
    const link = result[0]
  
    await redis.zIncrBy('metrics', 1, String(link.id))
  
    if (result.length)
      reply.redirect(301, link.original_url)
  })
}