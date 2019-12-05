const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Room')
		.where('roomID', '=', id)
		.first()
}

// ALL
router.get('/all', async ctx => {
	const rooms = await knex
		.select('*')
		.from('Room')

	ctx.body = rooms
})

// GET A ROOM
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const room = await get_from_id(id)
	if (!room) ctx.throw(404)

	ctx.body = room
})

// CREATE A ROOM
router.post('/', required(['capacity']), async ctx => {
	const { capacity } = ctx.request.body

	const id = await knex('Room').insert({ capacity })
	const seats = []

	// CREATE ROOMSEATS
	for (let i = 0; i < capacity; i++) 
		seats.push({ seatID: i, roomID: id[0] })
	await knex('RoomSeat')
		.insert(seats)
		.catch(err => ctx.throw(404))

	const room = await get_from_id(id)

	ctx.body = room
})

// UPDATE A ROOM
router.put('/:id', async (ctx) => {
	const roomID = ctx.params.id
	const { capacity } = ctx.request.body
	
	const old_room = await get_from_id(roomID)

	await knex('Room')
		.where('roomID', '=', roomID)
		.update({ capacity })
		.catch(err => ctx.throw(404))

	const new_room = await get_from_id(roomID)

	if (new_room.capacity > old_room.capacity) {
		const seats = []
		for (let i = old_room.capacity; i < new_room.capacity; ++i)
			seats.push({ roomID, seatID: i })
		await knex('RoomSeat')
			.insert(seats)
			.catch(err => ctx.throw(404))
	} else if (new_room.capacity < old_room.capacity) {
		await knex('RoomSeat')
			.where('roomID', '=', roomID)
			.where('seatID', '>', new_room.capacity)
			.delete()
	}

	ctx.body = new_room
})

// DELETE A ROOM
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Room')
		.where('roomID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
