const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Screening')
		.where('screeningID', '=', id)
		.first()
}

// ALL
router.get('/all', async ctx => {
	const screening = await knex
		.select('*')
		.from('Screening')

	ctx.body = screening
})

// GET A SCREENING
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const screening = await get_from_id(id)
	if (!screening) ctx.throw(404)

	ctx.body = screening
})

// CREATE A SCREENING
router.post('/', required(['movieID', 'roomID', 'begin', 'end', 'projectionTypeID']), async ctx => {
	const { movieID, roomID, begin, end, projectionTypeID } = ctx.request.body

	const id = await knex('Screening')
		.insert({ 
			movieID, 
			roomID, 
			begin: new Date(begin), 
			end: new Date(end), 
			projectionTypeID 
		})
		.catch(err => ctx.throw(404))
	const screening = await get_from_id(id)

	ctx.body = screening
})

// UPDATE A SCREENING
router.put('/:id', async (ctx) => {
	const { id } = ctx.params
	const { movieID, roomID, begin, end, projectionTypeID } = ctx.request.body

	await knex('Screening')
		.where('screeningID', '=', id)
		.update({ movieID, roomID, begin, end, projectionType })
		.catch(err => ctx.throw(404))

	ctx.body = await get_from_id(id)
})

// DELETE A SCREENING
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Screening')
		.where('screeningID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
