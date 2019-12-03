const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_from_id = id => {
	return knex
		.select('*')
		.from('Food')
		.where('foodID', '=', id)
		.first()
}

// GET A FOOD
router.get('/:id', async ctx => {
	const id = ctx.params.id

	const food = await get_from_id(id)
	if (!food) ctx.throw(404)

	ctx.body = food
})

// CREATE A FOOD
router.post('/', required(['foodName', 'typeFood', 'price']), async ctx => {
	const { foodName, typeFood, price } = ctx.request.body

	const id = await knex('Food')
		.insert({ foodName, typeFood, price })
		.catch(err => ctx.throw(404))
	const food = await get_from_id(id)

	ctx.body = food
})

// UPDATE A FOOD
router.put('/:id', async (ctx) => {
	const foodID = ctx.params.id
	const { foodName, typeFood, price } = ctx.request.body

	await knex('Food')
		.where('foodID', '=', foodID)
		.update({ foodName, typeFood, price })

	ctx.body = await get_from_id(foodID)
})

// DELETE A FOOD
router.delete('/:id', async ctx => {
	const id = ctx.params.id

	const nb_deleted = await knex('Food')
		.where('foodID', '=', id)
		.delete()

	if (!nb_deleted) ctx.throw(404)

	ctx.body = {}
})

module.exports = router
