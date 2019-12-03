const required = required => {
	return async (ctx, next) => {
		for (const r of required) {
			ctx.assert(
				ctx.request.body[r],
				400,
				`Query must contains ${required} fields`
			)
		}
		await next()
	}
}

module.exports = { required }
