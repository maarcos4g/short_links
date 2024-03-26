import { sql } from '@/lib/postgres'
import { redis } from '@/lib/redis'
import fastify from 'fastify'
import postgres from 'postgres'
import { z } from 'zod'

const app = fastify()

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

app.get('/api/links', async () => {
  const results = await sql/*sql*/`
  SELECT *
  FROM short_links
  ORDER BY created_at DESC
  `

  return results
})

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

app.listen({
  port: 3333,
  host: '0.0.0.0'
}).then(() => console.log('🔥 HTTP Server Running!'))