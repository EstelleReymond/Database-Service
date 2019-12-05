const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_screening = async screeningID => {
	return await knex
		.select('*')
		.from('Screening')
		.where('screeningID', '=', screeningID)
		.first()
}

const create_customer = async (screeningID, age) => {
	const inserted = await knex('Customer')
		.insert({ screeningID, age })
		.catch(err => ctx.throw(500, 'insert failed'))
	return inserted[0]
}

const create_customer_seats = async (customerID, roomID, seats_ids) => {
	return await knex('CustomerSeat')
		.insert(seats_ids.map(seatID => ({customerID, roomID, seatID })))
		.catch(err => ctx.throw(500, 'insert failed'))
}

const get_screening_seats_ids = async screeningID => {
	return await knex
		.select('CustomerSeat.seatID')
		.from('CustomerSeat')
		.leftJoin('Customer', 'Customer.customerID', 'CustomerSeat.customerID')
		.andWhere('Customer.screeningID', screeningID)
		.then(seats => { return seats.map(e => e.seatID) })
}

const get_customer_seats = async (customerID, screeningID) => {
	return await knex
		.select('*')
		.from('CustomerSeat')
		.leftJoin('Customer', 'Customer.customerID', 'CustomerSeat.customerID')
		.where('CustomerSeat.customerID', customerID)
		.andWhere('Customer.screeningID', screeningID)
}

const get_movie = async movieID => {
	return await knex
		.select('Movie.ageNeeded')
		.from('Movie')
		.where('movieID', movieID)
		.first()
}

router.post('/', required(['screeningID', 'seats_ids', 'age']), async ctx => {
	const { screeningID, age, seats_ids } = ctx.request.body
	
	if (!Array.isArray(seats_ids) || !seats_ids.length)
		ctx.throw(400, 'seats_ids must be a non empty array')

	const occupied_seats_ids = await get_screening_seats_ids(screeningID)
	const are_occupied = seats_ids
		.map(seat_id => occupied_seats_ids.some(oc_seat_id => oc_seat_id === seat_id))
		.some(seat_id => seat_id === true)

	if (are_occupied) 
		ctx.throw(409, 'seats already occupied')

	const screening = await get_screening(screeningID)
	const movie = await get_movie(screening.movieID)
	if (age < movie.ageNeeded)
		ctx.throw(403, 'too young')
	const customerID = await create_customer(screeningID, age)
	await create_customer_seats(customerID, screening.roomID, seats_ids)
	const customer_seats = await get_customer_seats(customerID, screeningID)

	ctx.body = {
		screening,
		customerID,
		seats: customer_seats
	}
})

module.exports = router
