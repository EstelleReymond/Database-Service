const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = (customerID, roomID, seatID) => {
	return knex
		.select('*')
		.from('CustomerSeat')
		.where('customerID', '=', customerID)
		.where('roomID', '=', roomID)
		.where('seatID', '=', seatID)
		.first()
}

// ALL
router.get('/all', async ctx => {
	const seats = await knex
		.select('*')
		.from('CustomerSeat')

	ctx.body = seats
})


// GET A CUSTOMER SEAT /// A REVOIR
router.get('/:customer_id/:room_id/:seat_id', async ctx => {
	const { customer_id, room_id, seat_id } = ctx.params

	const customerSeat = await get_from_id(customer_id, room_id, seat_id)
	if (!customerSeat) ctx.throw(404)

	ctx.body = customerSeat
})

// CREATE A CUSTOMER SEAT
router.post('/', required(['customerID', 'roomID', 'seatID']), async ctx => {
	const { customerID, roomID, seatID } = ctx.request.body

	const id = await knex('CustomerSeat')
		.insert({ customerID, roomID, seatID })
		.catch(err => ctx.throw(404))
	const customerSeat = await get_from_id(customerID, roomID, seatID)

	ctx.body = customerSeat
})

// DELETE A CUSTOMER SEAT
router.delete('/:customer_id/:room_id/:seat_id', async ctx => {
	const { customerID, roomID, seatID } = ctx.params

	const nb_deleted = await knex('CustomerSeat')
		.where('customerID', '=', id)
		.where('roomID', '=', roomID)
		.where('seatID', '=', seatID)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
