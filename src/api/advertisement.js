const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Advertisement')
		.where('adID', '=', id)
		.first()
}

// GET AN ADVERTISEMENT
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const advertisement = await get_from_id(id)
	if (!advertisement) ctx.throw(404)

	ctx.body = advertisement
})

// GET MOVIES OF AN ADVERTISEMENT
router.get('/:id/movies', async ctx => {
	const advertisementID = ctx.params.id

	const movies = await knex
		.select('Movie.*')
		.from('MovieAdvertisement')
		.rightJoin('Movie', 'MovieAdvertisement.movieID', 'Movie.movieID')
		.where('MovieAdvertisement.advertisementID', '=', advertisementID)

	ctx.body = movies
})

// CREATE AN ADVERTISEMENT
router.post('/', required([]), async ctx => {
	const { brandName, duration } = ctx.request.body

	const id = await knex('Advertisement')
		.insert({ brandName, duration })
		.catch(err => ctx.throw(404))
	const advertisement = await get_from_id(id)

	ctx.body = advertisement
})

// ADD AN ADVERTISEMENT TO MOVIE
router.post('/:id/movie', required(['movieID']), async ctx => {
	const { movieID } = ctx.request.body
	const advertisementID = ctx.params.id

	try {
		await knex('MovieAdvertisement').insert({ movieID, advertisementID })
	} catch (err) {
		ctx.throw(409)
	}

	ctx.body = {}
})

// UPDATE AN ADVERTISEMENT
router.put('/:id', async (ctx) => {
	const adID = ctx.params.id
	const { brandName, duration } = ctx.request.body

	await knex('Advertisement')
		.where('adID', '=', adID)
		.update({ brandName, duration })
	
	ctx.body = await get_from_id(adID)
})

// DELETE AN ADVERTISEMENT
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Advertisement')
		.where('adID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
