const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Director')
		.where('directorID', '=', id)
		.first()
}

// ALL
router.get('/all', async ctx => {
	const directors = await knex
		.select('*')
		.from('Director')

	ctx.body = directors
})

// GET A DIRECTOR
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const actor = await get_from_id(id)
	if (!actor) ctx.throw(404)

	ctx.body = actor
})

// GET MOVIES OF A DIRECTOR
router.get('/:id/movies', async ctx => {
	const directorID = ctx.params.id

	const movies = await knex
		.select('Movie.*')
		.from('MovieDirector')
		.rightJoin('Movie', 'MovieDirector.movieID', 'Movie.movieID')
		.where('MovieDirector.directorID', '=', directorID)

	ctx.body = movies
})

// CREATE A DIRECTOR
router.post('/', required([]), async ctx => {
	const { lastName, firstName } = ctx.request.body

	const id = await knex('Director')
		.insert({ lastName, firstName })
		.catch(err => ctx.throw(404))
	const actor = await get_from_id(id)

	ctx.body = actor
})

// ADD A DIRECTOR TO MOVIE
router.post('/:id/movie', required(['movieID']), async ctx => {
	let { movieID } = ctx.request.body
	const directorID = ctx.params.id

	try {
		await knex('MovieDirector').insert({ movieID, directorID })
	} catch (err) {
		ctx.throw(409)
	}

	ctx.body = {}
})

// UPDATE A DIRECTOR
router.put('/:id', async (ctx) => {
	const directorID = ctx.params.id
	const { lastName, firstName } = ctx.request.body

	await knex('Director')
		.where('directorID', '=', directorID)
		.update({ lastName, firstName })

	ctx.body = await get_from_id(directorID)
})

// DELETE A DIRECTOR
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Director')
		.where('directorID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
