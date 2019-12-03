const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Genre')
		.where('genreID', '=', id)
		.first()
}

// GET A GENRE
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const genre = await get_from_id(id)
	if (!genre) ctx.throw(404)

	ctx.body = genre
})

// GET MOVIES OF A GENRE
router.get('/:id/movies', async ctx => {
	const genreID = ctx.params.id

	const movies = await knex
		.select('Movie.*')
		.from('MovieGenre')
		.rightJoin('Movie', 'MovieGenre.movieID', 'Movie.movieID')
		.where('MovieGenre.genreID', '=', genreID)

	ctx.body = movies
})

// CREATE A GENRE
router.post('/', required([]), async ctx => {
	const { genreName } = ctx.request.body

	const id = await knex('Genre')
		.insert({ genreName })
		.catch(err => ctx.throw(404))
	const genre = await get_from_id(id)

	ctx.body = genre
})

// ADD A GENRE TO MOVIE
router.post('/:id/movie', required(['movieID']), async ctx => {
	let { movieID } = ctx.request.body
	const genreID = ctx.params.id

	try {
		await knex('MovieGenre').insert({ movieID, genreID })
	} catch (err) {
		ctx.throw(409)
	}

	ctx.body = {}
})

// UPDATE A GENRE
router.put('/:id', async (ctx) => {
	const genreID = ctx.params.id
	const { genreName } = ctx.request.body

	await knex('Genre')
		.where('genreID', '=', genreID)
		.update({ genreName })

	ctx.body = await get_from_id(genreID)
})

// DELETE A GENRE
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Genre')
		.where('genreID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
