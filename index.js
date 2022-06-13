// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true });

// Declare a route
fastify.get('/', async (request, reply) => {
	return { hello: 'world' };
});

// Run the server!
const start = async () => {
	try {
		await fastify.listen(
			process.env.PORT || 18082,
			'0.0.0.0',
			function (err, address) {
				if (err) {
					fastify.log.error(err);
					process.exit(1);
				}
				fastify.log.info(`server listening on ${address}`);
			},
		);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
