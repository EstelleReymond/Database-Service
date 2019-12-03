const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('ProjectionType')
		.where('projectionTypeID', '=', id)
		.first()
}

// GET A PROJECTIONTYPE
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const projectionType = await get_from_id(id)
	if (!projectionType) ctx.throw(404)

	ctx.body = projectionType
})

// CREATE A PROJECTIONTYPE
router.post('/', required([]), async ctx => {
	const { projectionTypeName, price } = ctx.request.body

	const id = await knex('ProjectionType')
		.insert({ projectionTypeName, price })
		.catch(err => ctx.throw(404))
	const projectionType = await get_from_id(id)

	ctx.body = projectionType
})

// UPDATE A PROJECTIONTYPE
router.put('/:id', async (ctx) => {
	const projectionTypeID = ctx.params.id
	const { projectionTypeName, price } = ctx.request.body

	await knex('ProjectionType')
		.where('projectionTypeID', '=', projectionTypeID)
		.update({ projectionTypeName, price  })

	ctx.body = await get_from_id(projectionTypeID)
})

// DELETE A PROJECTIONTYPE
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('ProjectionType')
		.where('projectionTypeID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
