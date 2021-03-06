const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Customer')
		.where('customerID', '=', id)
		.first()
}

// ALL
router.get('/all', async ctx => {
	const customers = await knex
		.select('*')
		.from('Customer')

	ctx.body = customers
})

// GET A CUSTOMER
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const customer = await get_from_id(id)
	if (!customer) ctx.throw(404)

	ctx.body = customer
})

// CREATE A CUSTOMER
router.post('/', required(['screeningID', 'age']), async ctx => {
	const { screeningID, age } = ctx.request.body

	const id = await knex('Customer')
		.insert({ screeningID, age })
		.catch(err => ctx.throw(404))
	const customer = await get_from_id(id)

	ctx.body = customer
})

// GET ALL CUSTOMER FOR A MOVIE
router.get('/movie/:id_movie', async ctx => {
    const movieID = ctx.params.id_movie

    const customers = await knex
    	.select('customerID')
    	.from('Customer')
    	.innerJoin('Screening','Screening.screeningID','Customer.screeningID')
    	.where('movieID','=', movieID)
	ctx.body = customers;
	
})


//GET CUSTOMER SEAT
router.get('/:id/seat', async ctx => {
	const customerID = ctx.params.id
	const seat = await knex
	.select('CustomerSeat.seatID','CustomerSeat.roomID')
	.from('CustomerSeat')
	.where('CustomerSeat.customerID','=', customerID)
ctx.body = CustomerSeat;
})


// UPDATE A CUSTOMER
router.put('/:id', async (ctx) => {
	const customerID = ctx.params.id
	const { foodID, screeningID, age } = ctx.request.body

	await knex('Customer')
		.where('customerID', '=', customerID)
		.update({ foodID, screeningID, age })

	ctx.body = await get_from_id(customerID)
})

// DELETE A CUSTOMER
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Customer')
		.where('customerID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
