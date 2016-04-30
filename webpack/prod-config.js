var path = require( 'path' );
var webpack = require( 'webpack' );
var appPath = path.join( __dirname, '..', 'app' );
var assetsPath = path.join( __dirname, '..', 'public', 'assets' );
var sharedConfig = require( './shared.js' );
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
var InlineEnviromentVariablesPlugin = require( 'inline-environment-variables-webpack-plugin' );


module.exports = {
	// A SourceMap is emitted.
	devtool: 'source-map',
	context: appPath,
	// Multiple entry with hot loader
	// https://github.com/glenjamin/webpack-hot-middleware/blob/master/example/webpack.config.multientry.js
	entry: {
		app: [ './index' ]
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
				presets: [ 'es2015', 'react', 'stage-0' ],
				plugins: [
					'transform-react-remove-prop-types',
					'transform-react-constant-elements',
					'transform-react-inline-elements'
				]
			},
			include: appPath,
			exclude: path.join( __dirname, '/node_modules/' )
		}, {
			test: /\.css$/,
			loader: ExtractTextPlugin.extract( 'style-loader', 'css-loader!postcss-loader' )
		}])
	},
	resolve: {
		extensions: [ '', '.js', '.jsx', '.css' ],
		modulesDirectories: [ 'app', 'node_modules' ]
	},
	plugins: [
		new ExtractTextPlugin( 'style.css' ),
		new webpack.NoErrorsPlugin(),
		new InlineEnviromentVariablesPlugin({ NODE_ENV: 'production' }),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
	],
	postcss: function() {
		return [
			require( 'postcss-import' )({
				path: path.join( __dirname, '..', 'app', 'css' ),
				// addDependencyTo is used for hot-reloading in webpack
				addDependencyTo: webpack
			}),
			require( 'postcss-mixins' )(),
			require( 'postcss-simple-vars' )(),
			// Unwrap nested rules like how Sass does it
			require( 'postcss-nested' )(),
			//  parse CSS and add vendor prefixes to CSS rules
			require( 'autoprefixer' )({
				browsers: [ 'last 2 versions', 'IE > 8' ]
			}),
			// A PostCSS plugin to console.log() the messages registered by other
			// PostCSS plugins
			require( 'postcss-reporter' )({
				clearMessages: true
			})
		];
	}
};
