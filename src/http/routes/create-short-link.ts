import { sql } from "@/lib/postgres";
import { FastifyInstance } from "fastify";
import postgres from "postgres";
import { z } from "zod";

export async function createShortLink(app: FastifyInstance) {
  app.post('/api/links', async ({ body }, reply) => {
    const createLinkSchema = z.object({
      code: z.string().min(3),
      url: z.string().url()
    })

    const { code, url } = createLinkSchema.parse(body)

    try {
      const result = await sql/*sql*/`
    INSERT INTO short_links (code, original_url)
    VALUES (${code}, ${url})
    RETURNING id 
    `

      const link = result[0]

      return reply.status(201).send({ shortLinkId: link.id })
    } catch (error) {
      if (error instanceof postgres.PostgresError) {
        if (error.code === '23505') {
          return reply.status(400).send({ message: "Duplicated code" })
        }
      }

      console.error(error)

      return reply.status(500).send({ message: "Internal server error." })
    }
  })
}