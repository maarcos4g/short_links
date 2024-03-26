import { sql } from "@/lib/postgres";
import { FastifyInstance } from "fastify";

export async function getLinkDetails(app: FastifyInstance) {
  app.get('/api/links', async () => {
    const results = await sql/*sql*/`
    SELECT *
    FROM short_links
    ORDER BY created_at DESC
    `

    return results
  })
}