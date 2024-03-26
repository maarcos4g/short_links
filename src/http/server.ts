import fastify from 'fastify'
import fastifyCors from '@fastify/cors'

import { createShortLink } from './routes/create-short-link'
import { getLinkDetails } from './routes/get-link-details'
import { getLinkMetrics } from './routes/get-link-metrics'
import { redirectToLink } from './routes/redirect-to-link'

const app = fastify()

app.register(fastifyCors, {
  origin: '*'
})

app.register(createShortLink)
app.register(getLinkDetails)
app.register(getLinkMetrics)
app.register(redirectToLink)

app.listen({
  port: 3333,
  host: '0.0.0.0'
}).then(() => console.log('🔥 HTTP Server Running!'))