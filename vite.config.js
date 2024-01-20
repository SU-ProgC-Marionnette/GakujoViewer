const Path = require('path');
const vuePlugin = require('@vitejs/plugin-vue')

const { defineConfig } = require('vite');

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
	root: Path.join(__dirname, 'src', 'renderer'),
	publicDir: 'public',
	server: {
		port: 8080,
	},
	open: false,
	build: {
		outDir: Path.join(__dirname, 'build', 'renderer'),
		emptyOutDir: true,
	},
	plugins: [vuePlugin()],
	define: {
		__INTLIFY_JIT_COMPILATION__: true,
		APP_VERSION: JSON.stringify(process.env.npm_package_version)
	}
});

module.exports = config;
