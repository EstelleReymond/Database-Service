const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Actor')
		.where('actorID', '=', id)
		.first()
}

// GET AN ACTOR
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const actor = await get_from_id(id)
	if (!actor) ctx.throw(404)

	ctx.body = actor
})

// GET MOVIES OF AN ACTOR
router.get('/:id/movies', async ctx => {
	const actorID = ctx.params.id

	const movies = await knex
		.select('Movie.*')
		.from('MovieActor')
		.rightJoin('Movie', 'MovieActor.movieID', 'Movie.movieID')
		.where('MovieActor.actorID', '=', actorID)

	ctx.body = movies
})

// CREATE AN ACTOR
router.post('/', required([]), async ctx => {
	const { lastName, firstName } = ctx.request.body

	const id = await knex('Actor')
		.insert({ lastName, firstName })
		.catch(err => ctx.throw(404))
	const actor = await get_from_id(id)

	ctx.body = actor
})

// ADD AN ACTOR TO MOVIE
router.post('/:id/movie', required(['movieID']), async ctx => {
	const { movieID } = ctx.request.body
	const actorID = ctx.params.id

	try {
		await knex('MovieActor').insert({ movieID, actorID })
	} catch (err) {
		ctx.throw(409)
	}

	ctx.body = {}
})

// UPDATE AN ACTOR
router.put('/:id', async (ctx) => {
	const actorID = ctx.params.id
	const { lastName, firstName } = ctx.request.body

	await knex('Actor')
		.where('actorID', '=', actorID)
		.update({ lastName, firstName })

	ctx.body = await get_from_id(actorID)
})

// DELETE AN ACTOR
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Actor')
		.where('actorID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
