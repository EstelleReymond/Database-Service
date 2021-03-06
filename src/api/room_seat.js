const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = (room_id, seat_id) => {
	return knex
		.select('*')
		.from('RoomSeat')
		.where('roomID', '=', room_id)
		.where('seatID', '=', seat_id)
		.first()
}

// ALL BY ROOMID
router.get('/all/:room_id', async ctx => {
	const room_id = ctx.params.room_id

	const seats = await knex
		.select('seatID')
		.from('RoomSeat')
		.where('roomID','=',room_id)

	ctx.body = seats
})
// GET A ROOMSEAT
router.get('/:room_id/:seat_id', async ctx => {
	const roomID = ctx.params.room_id
	const seatID = ctx.params.seat_id

	const room = await get_from_id(roomID, seatID)
	if (!room) ctx.throw(404)

	ctx.body = room
})

// CREATE A ROOMSEAT
router.post('/', required(['roomID', 'seatID']), async ctx => {
	//const roomID = ctx.params.room_id
	const { room_id, seat_id } = ctx.request.body
	const available = ctx.request.body.available || true

	const id = await knex('RoomSeat')
		.insert({ room_id, seat_id, available })
		.catch(err => ctx.throw(404))
	const room_seat = await get_from_id(room_id, seat_id)

	ctx.body = room_seat
})

// UPDATE A ROOMSEAT
router.put('/:room_id/:seat_id', async (ctx) => {
	const { room_id, seat_id } = ctx.params
	const { available } = ctx.request.body

	await knex('RoomSeat')
		.where('roomID', '=', room_id)
		.where('seatID', '=', seat_id)
		.update({ available })
		.catch(err => ctx.throw(404))

	ctx.body = await get_from_id(room_id, seat_id)
})

// DELETE A ROOMSEAT
router.delete('/:room_id/:seat_id', async ctx => {
	const roomID = ctx.params.room_id
	const seatID = ctx.params.seat_id

	const nb_deleted = await knex('RoomSeat')
		.where('roomID', '=', roomID)
		.where('seatID', '=', seatID)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
