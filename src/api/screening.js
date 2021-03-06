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

// GET ALL SCREENING BY WEEK
router.get('/next_n_days/:n_days', async ctx => {
	const n_days = parseInt(ctx.params.n_days)

	const begin = new Date()
	const end = new Date()
	if (Number.isNaN(n_days)) ctx.throw(400, '\`n_days\` should be a number')
	end.setDate(end.getDate() + parseInt(n_days))

	const screenings = await knex
		.select('*')
		.from('Screening')
		.where('begin', '>=', begin.toISOString())
		.where('begin', '<=', end.toISOString())
		.orderBy('begin')

	ctx.body = screenings
})

// GET ALL SCREENING FROM TODAY
router.get('/all/today', async ctx => {
	const today = new Date()
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)

	const remove_time = date => {
		date.setHours(0)
		date.setMinutes(0)
		date.setSeconds(0)
	}

	remove_time(tomorrow)

	const screenings = await knex
		.select('*')
		.from('Screening')
		.where('begin', '>=', today)
		.where('begin', '<=', tomorrow)

	ctx.body = screenings
})

// GET ALL FROM A MOVIE
router.get('/all/of_movie/:movie_id', async ctx => {
	const { movie_id } = ctx.params

	const today = new Date()
	const screenings = await knex
		.select('*')
		.from('Screening')
		.where('begin' >= today.toISOString())
		.where('movieID', '=', movie_id)

	ctx.body = screenings
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

//DISPLAY CUSTOMERS FOR SCREENING
router.get('/:id_screening/customers', async ctx => {
	const screeningID = ctx.params.id_screening
	
    const customers = await knex
    	.select('Customer.customerID')
    	.from('Customer')
		.where('Customer.screeningID','=', screeningID)
		
    ctx.body = customers;
})


// UPDATE A SCREENING
router.put('/:id', async (ctx) => {
	const id = ctx.params.id
	const { movieID, roomID, begin, end, projectionTypeID } = ctx.request.body

	await knex('Screening')
		.where('screeningID', '=', id)
		.update({ movieID, roomID, begin, end, projectionTypeID })
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
