var path    = require( 'path' )
var webpack = require( 'webpack' )

module.exports = {
	entry: [ './js/src/index.js' ],
	output: {
		path: path.resolve( __dirname, 'js' ),
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			loaders: [ 'babel' ],
			exclude: /node_modules/
		}]
	},
	resolve: {
		extensions: [ '', '.js', '.jsx' ]
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ )
	]
}
