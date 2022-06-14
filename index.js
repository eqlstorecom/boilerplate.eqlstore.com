import { handler } from './build/handler.js';
import fastify from 'fastify';
import path from 'path';
import fastifyStatic from '@fastify/static';
import helmet from '@fastify/helmet';
import rate_limit from '@fastify/rate-limit';

(async () => {
	try {
		//fastify
		const app = fastify({
			connectionTimeout: 0,
			keepAliveTimeout: 5000,
			maxRequestsPerSocket: 0,
			requestTimeout: 0,
			ignoreTrailingSlash: true,
			bodyLimit: 1024 * 1024 * 10,
			disableRequestLogging: false,
		});

		//necessary!!!
		app.removeAllContentTypeParsers();
		app.addContentTypeParser('*', (req, payload, done) => done(null, null));

		//rate limit
		await app.register(rate_limit, {
			cache: 10000,
			allowList: ['127.0.0.1', 'localhost'],
			keyGenerator: req =>
				req.headers['x-real-ip'] ||
				req.headers['x-client-ip'] ||
				req.headers['x-forwarded-for'] ||
				req.ip,
		});

		await app.register(helmet, {
			contentSecurityPolicy: false,
			crossOriginEmbedderPolicy: false,
		});

		//other path
		app.get('/check', async (req, res) => {
			return 'ok';
		});

		//rate limit
		app.get(
			'/429',
			{
				config: {
					rateLimit: {
						max: async (req, key) => {
							return 1000;
						},
						timeWindow: 1000 * 60,
					},
				},
			},
			(req, res) => handler(req.raw, res.raw, () => {}),
		);

		app.all(
			'/*',
			{
				config: {
					rateLimit: {
						max: async (req, key) => {
							console.log('req.url', req.url.startsWith('/api/'));
							if (req.url.startsWith('/api/')) {
								return 500;
							} else {
								return 1000;
							}
						},
						timeWindow: 1000 * 60,
					},
				},
				errorHandler: (error, req, res) => {
					if (error.message.startsWith('Rate limit exceeded')) {
						res.code(302).redirect('/429');
					} else {
						throw error;
					}
				},
			},
			(req, res) => handler(req.raw, res.raw, () => {}),
		);

		app.listen({ port: 18082 }, '0.0.0.0', (err, address) => {
			if (err) {
				app.log.error(err);
				process.exit(1);
			}
			// app.log.info(`server listening on ${address}`);
		});

		// await app.listen(
		// 	process.env.PORT || 18082,
		// 	'0.0.0.0',
		// 	(err, address) =>{
		// 		if (err) {
		// 			fastify.log.error(err);
		// 			process.exit(1);
		// 		}
		// 		fastify.log.info(`server listening on ${address}`);
		// 	},
		// );
	} catch (e) {
		console.log(e);
		process.exit(-1);
	}
})();
