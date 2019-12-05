const knex = require('../knex')

const Router = require('@koa/router')
const router = new Router()

const { required } = require('../utils')

const get_customer = async customerID => {
	return knex
		.select('*')
		.from('Customer')
		.where('customerID', customerID)
		.first()
}

const set_food_id = async (customerID, foodID) => {
	return knex('Customer')
		.update({foodID})
		.where('customerID', customerID)
}

router.post('/', required(['customerID', 'foodID']), async ctx => {
	const { customerID, foodID } = ctx.request.body

	const customer = await get_customer(customerID)

	if (customer.foodID)
		ctx.throw(403, 'already bought food')
	
	await set_food_id(customerID, foodID)

	ctx.body = await get_customer(customerID)
})

module.exports = router
