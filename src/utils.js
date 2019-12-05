const required = required => {
	return async (ctx, next) => {
		for (const r of required) {
			ctx.assert(
				r in ctx.request.body,
				400,
				`Query must contains ${required} fields`
			)
		}
		await next()
	}
}

module.exports = { required }
