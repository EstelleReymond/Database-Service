
const koa = require('koa')
const app = new koa()

const body_parser = require('koa-bodyparser')
app.use(body_parser())

const Router = require('@koa/router')
const router = new Router()

router.get('/about', async ctx => {
	ctx.body = {
		version: 1.0,
		author: 'Estellou'
	}
})

app
	.use(router.routes())
	.use(router.allowedMethods())

const api = require('./api')
app
	.use(api.routes())
	.use(api.allowedMethods())

app.listen(8080)
