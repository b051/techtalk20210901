import * as cors from '@koa/cors'
import * as Koa from 'koa'
import { apollo_server } from './apollo_server'
import { db } from '../models'
import * as mount from 'koa-mount'
import * as serve from 'koa-static'
process.on('SIGINT', () => {
  process.exit(0)
})

async function main() {
  console.time('db.sync()..')
  await db.sync({ logging: false })
  console.timeEnd('db.sync()..')
  const app = new Koa()
  app.use(cors())
  app.use(mount('/docs', serve(`${__dirname}/../../docs/`)))
  apollo_server.applyMiddleware({ app })

  await new Promise<void>((resolve) => {
    app.listen(3030, () => resolve())
  })
  console.log(`api is ready`)
}

main()