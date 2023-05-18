const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'production', // required to run in an extension
	entry: {
		boost: './src/boost.ts',
	},
	module: {
		rules: [
			{
				test: /\.ts/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: 'src/manifest.json', to: 'manifest.json' },
				{ from: 'src/boost.css', to: 'boost.css' },
			],
		}),
	],

};
