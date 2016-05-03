var config = require( './dev-config.js' );
var webpack = require( 'webpack' );
var compiler = webpack( config );
var WebpackDevServer = require( 'webpack-dev-server' );
var PORT = process.env.PORT || 8080;

var server = new WebpackDevServer( compiler, {
	hot: true,
	stats: {
		colors: true
	},
	contentBase: 'public',
	publicPath: config.output.publicPath,
});

server.listen( PORT );
