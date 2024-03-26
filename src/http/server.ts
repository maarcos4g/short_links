import { sql } from '@/lib/postgres'
import fastify from 'fastify'
import { z } from 'zod'

const app = fastify()

app.post('/links', async ({ body }, reply) => {
  const createLinkSchema = z.object({
    code: z.string().min(3),
    url: z.string().url()
  })

  const { code, url } = createLinkSchema.parse(body)

  const result = await sql/*sql*/`
  INSERT INTO short_links (code, original_url)
  VALUES (${code}, ${url})
  RETURNING id 
  `

  const link = result[0]

  return reply.status(201).send({ shortLinkId: link.id })
})

app.listen({
  port: 3333,
  host: '0.0.0.0'
}).then(() => console.log('🔥 HTTP Server Running!'))