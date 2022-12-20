const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production', // required to run in an extension
	entry: {
		google: './src/google/google.js',

	},
	output: {
		path: path.resolve(__dirname, 'target'),
		filename: '[name].js'
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: 'src/manifest.json', to: 'manifest.json' },
				{ from: 'src/google/google.css', to: 'google.css' }
			],
		}),
	],

};
