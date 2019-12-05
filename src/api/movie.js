const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Movie')
		.where('movieID', '=', id)
		.first()
}

// ALL
router.get('/all', async ctx => {
	const movies = await knex
		.select('*')
		.from('Movie')

	ctx.body = movies
})

// GET A MOVIE
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const actor = await get_from_id(id)
	if (!actor) ctx.throw(404)

	ctx.body = actor
})

// CREATE A MOVIE
router.post('/', required(['title', 'ageNeeded','duration']), async ctx => {
	let { title, ageNeeded, duration } = ctx.request.body

	const id = await knex('Movie')
		.insert({ title, ageNeeded, duration })
		.catch(err => ctx.throw(404))
	const actor = await get_from_id(id)

	ctx.body = actor
})

// GET ACTORS OF A MOVIE
router.get('/:id/actors', async ctx => {
	const movieID = ctx.params.id

	const actors = await knex
		.select('Actor.*')
		.from('MovieActor')
		.rightJoin('Actor', 'MovieActor.actorID', 'Actor.actorID')
		.where('MovieActor.movieID', '=', movieID)

	ctx.body = actors
})

// GET ALL MOVIE WITH A SPECIAL ACTOR
router.get('/actor/:id_actor', async ctx => {
	const actorID = ctx.params.id_actor

	const movies = await knex
		.select('*')
		.from('MovieActor')
		.rightJoin('Actor', 'MovieActor.actorID', 'Actor.actorID')
		.where('MovieActor.actorID', '=', actorID)

	ctx.body = movies
})

// GET GENRES OF A MOVIE
router.get('/:id/genres', async ctx => {
	const movieID = ctx.params.id

	const genres = await knex
		.select('Genre.*')
		.from('MovieGenre')
		.rightJoin('Genre', 'MovieGenre.genreID', 'Genre.genreID')
		.where('MovieGenre.movieID', '=', movieID)

	ctx.body = genres 
})

// GET DIRECTORS OF A MOVIE
router.get('/:id/directors', async ctx => {
	const movieID = ctx.params.id

	const directors = await knex
		.select('Director.*')
		.from('MovieDirector')
		.rightJoin('Director', 'MovieDirector.directorID', 'Director.directorID')
		.where('MovieDirector.movieID', '=', movieID)

	ctx.body = directors
})

// GET ADS OF A MOVIE
router.get('/:id/ads', async ctx => {
	const movieID = ctx.params.id

	const advertisements = await knex
		.select('Advertisement.*')
		.from('MovieAdvertisement')
		.rightJoin('Advertisement', 'MovieAdvertisement.advertisementID', 'Advertisement.adID')
		.where('MovieAdvertisement.movieID', '=', movieID)

	ctx.body = advertisements
})

// ADD AN ACTOR TO MOVIE
router.post('/:id/actor', required(['actorID']), async ctx => {
	let { actorID } = ctx.request.body
	const movieID = ctx.params.id

	try {
		await knex('MovieActor').insert({ movieID, actorID })
	} catch (err) {
		ctx.throw(409)
	}

	ctx.body = {}
})

// ADD A DIRECTOR TO MOVIE
router.post('/:id/director', required(['directorID']), async ctx => {
	let { directorID } = ctx.request.body
	const movieID = ctx.params.id

	try {
		await knex('MovieDirector').insert({ movieID, directorID })
	} catch (err) {
		ctx.throw(409)
	}

	ctx.body = {}
})

// ADD AN AD TO MOVIE
router.post('/:id/ad', required(['advertisementID']), async ctx => {
	let { advertisementID } = ctx.request.body
	const movieID = ctx.params.id

	try {
		await knex('MovieAdvertisement').insert({ movieID, advertisementID })
	} catch (err) {
		ctx.throw(409)
	}

	ctx.body = {}
})

// ADD A GENRE TO MOVIE
router.post('/:id/genre', required(['genreID']), async ctx => {
	let { genreID } = ctx.request.body
	const movieID = ctx.params.id

	try {
		await knex('MovieGenre').insert({ movieID, genreID })
	} catch (err) {
		ctx.throw(409)
	}

	ctx.body = {}
})


// GET MOVIE WITH THE AGENEEDED
router.get('/by_age/:age', async ctx => {
	const age = ctx.params.age

	const movie = await knex
		.select('*')
		.from('Movie')
		.where('ageNeeded', '<=', age)

	ctx.body = movie
})

// GET ROOM OF A MOVIE
router.get('/:id/room', async ctx => {
	const movieID = ctx.params.id

	const room = await knex
		.select('Room.*') 
		.from('MovieRoom')
		.rightJoin('Movie', 'MovieRoom.movieID', 'Movie.movieID')
		.where('movieID', '=', movieID)

	ctx.body = movie
})


// UPDATE A MOVIE
router.put('/:id', async (ctx) => {
	const movieID = ctx.params.id
	const { title, ageNeeded, duration } = ctx.request.body

	await knex('Movie')
		.where('movieID', '=', movieID)
		.update({ title, ageNeeded, duration })

	ctx.body = await get_from_id(movieID)
})

// DELETE AN ACTOR
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Movie')
		.where('movieID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
