var config = require( './dev-config.js' );
var webpack = require( 'webpack' );
var compiler = webpack( config );
var WebpackDevServer = require( 'webpack-dev-server' );
var server = new WebpackDevServer( compiler, {
	hot: true,
	stats: {
		colors: true
	},
	contentBase: 'public',
	publicPath: config.output.publicPath
});

server.listen( 8080 );
