/* eslint-disable import/no-extraneous-dependencies */

const config = require( './dev-config.js' );
const webpack = require( 'webpack' );
const WebpackDevServer = require( 'webpack-dev-server' );

const compiler = webpack( config );
const PORT = process.env.PORT || 8080;

const server = new WebpackDevServer( compiler, {
	hot: true,
	stats: {
		colors: true
	},
	contentBase: 'public',
	publicPath: config.output.publicPath,
	watchOptions: {
		aggregateTimeout: 300,
		poll: 2000
	}
});

server.listen( PORT );
