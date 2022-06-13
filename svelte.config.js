// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import watchAndRun from '@kitql/vite-plugin-watch-and-run';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	experimental: {
		useVitePreprocess: true
	},
	kit: {
		// adapter: adapter()
		adapter: adapter({
			out: 'build',
			precompress: true,
			envPrefix: ''
		}),
		vite: {
			plugins: [
				watchAndRun([
					{
						watch: '**/*.(gql|graphql)',
						run: 'npm run gen'
					}
				])
			]
		}
	}
};

export default config;
