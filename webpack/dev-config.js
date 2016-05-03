var path = require( 'path' );
var webpack = require( 'webpack' );
var appPath = path.join( __dirname, '..', 'app' );
var assetsPath = path.join( __dirname, '..', 'public', 'assets' );
//var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
var sharedConfig = require( './shared.js' );
var PORT = process.env.PORT || 8080;


module.exports = {
	// eval - Each module is executed with eval and //@ sourceURL.
	devtool: 'eval',
	debug: true,
	name: 'browser',
	context: appPath,
	// Multiple entry with hot loader
	// https://github.com/glenjamin/webpack-hot-middleware/blob/master/example/webpack.config.multientry.js
	entry: {
		app: [
			'webpack-dev-server/client?http://localhost:' + PORT,
			'webpack/hot/dev-server',
			'./index'
		]
	},
	output: {
		// The output directory as absolute path
		path: assetsPath,
		// The filename of the entry chunk as relative path inside the output.path directory
		filename: '[name].js',
		// The output path from the view of the Javascript
		publicPath: '/assets/'
	},
	module: {
		loaders: sharedConfig.loaders.concat([{
			/*
			* TC39 categorises proposals for babel in 4 stages
			* Read more http://babeljs.io/docs/usage/experimental/
			*/
			test: /\.js$|\.jsx$/,
			loader: 'babel',
			// Reason why we put this here instead of babelrc
			// https://github.com/gaearon/react-transform-hmr/issues/5#issuecomment-142313637
			query: {
				presets: [ 'react-hmre', 'es2015', 'react', 'stage-0' ],
				plugins: [
					'transform-react-remove-prop-types'
				]
			},
			include: appPath,
			exclude: path.join( __dirname, '/node_modules/' )
		}, {
			test: /\.css$/,
			loader: 'style!css?module&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
		}])
	},
	resolve: {
		extensions: [ '', '.js', '.jsx', '.css' ],
		modulesDirectories: [ 'app', 'node_modules' ]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	postcss: sharedConfig.postcss
};
