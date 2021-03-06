const Router = require('@koa/router')
const router = new Router()

const actor_router = require('./actor')
const movie_router = require('./movie')
const ad_router = require('./advertisement')
const director_router = require('./director')
const genre_router = require('./genre')
const room_router = require('./room')
const room_seat_router = require('./room_seat')
const projection_type_router = require('./projection_type')
const screening_router = require('./screening')
const food_router = require('./food')
const customer_router = require('./customer')
const customer_seat_router = require('./customer_seat')

const make_reservation_router = require('./make_reservation')
const buy_food_router = require('./buy_food')

router.use('/actor', actor_router.routes(), actor_router.allowedMethods())
router.use('/movie', movie_router.routes(), movie_router.allowedMethods())
router.use('/ad', ad_router.routes(), ad_router.allowedMethods())
router.use('/director', director_router.routes(), director_router.allowedMethods())
router.use('/genre', genre_router.routes(), genre_router.allowedMethods())
router.use('/room', room_router.routes(), room_router.allowedMethods())
router.use('/room_seat', room_seat_router.routes(), room_seat_router.allowedMethods())
router.use('/projection_type', projection_type_router.routes(), projection_type_router.allowedMethods())
router.use('/screening', screening_router.routes(), screening_router.allowedMethods())
router.use('/food', food_router.routes(), food_router.allowedMethods())
router.use('/customer', customer_router.routes(), customer_router.allowedMethods())
router.use('/customer_seat', customer_seat_router.routes(), customer_seat_router.allowedMethods())
router.use('/make_reservation', make_reservation_router.routes(), make_reservation_router.allowedMethods())
router.use('/buy_food', buy_food_router.routes(), buy_food_router.allowedMethods())

module.exports = router
