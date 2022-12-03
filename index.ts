import Koa from 'koa'
import KoaBody from 'koa-body'
import bodyParser from 'koa-bodyparser'

import { createErrorMiddleware } from "koa-yup-validator"
import { bearerToken } from 'koa-bearer-token'

import personRouter from './src/routing/person'
import listRouting from './src/routing/list'
import taskRouting from './src/routing/task'

import settings from './src/settings'


const app = new Koa()
app.use(KoaBody())
app.use(bodyParser())
app.use(bearerToken())
app.use(createErrorMiddleware())

app.use(listRouting.routes())
app.use(listRouting.allowedMethods())

app.use(personRouter.routes())
app.use(personRouter.allowedMethods())

app.use(taskRouting.routes())
app.use(taskRouting.allowedMethods())

app.listen(settings.port, settings.hostname, async () => {
  console.log('Server running at: http://localhost:8080')
})