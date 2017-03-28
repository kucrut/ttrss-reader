const path = require( 'path' );
const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const merge = require( 'webpack-merge' );
const sharedConfig = require( './shared.js' );

const appPath = path.join( __dirname, '..', 'app' );

module.exports = merge( sharedConfig, {
	entry: {
		app: ['./index']
	},
	module: {
		rules: [{
			/*
			* TC39 categorises proposals for babel in 4 stages
			* Read more http://babeljs.io/docs/usage/experimental/
			*/
			test: /\.js$|\.jsx$/,
			use: {
				loader: 'babel-loader',
				// Reason why we put this here instead of babelrc
				// https://github.com/gaearon/react-transform-hmr/issues/5#issuecomment-142313637
				options: {
					presets: [
						'es2015',
						'react',
						'stage-0'
					],
					plugins: [
						'transform-react-remove-prop-types',
						'transform-react-constant-elements',
						'transform-react-inline-elements'
					]
				}
			},
			include: appPath,
			exclude: path.join( __dirname, '/node_modules/' )
		}, {
			test: /\.css$/,
			use: ExtractTextPlugin.extract({ use: 'css-loader?module!postcss-loader' })
		}]
	},
	plugins: [
		new ExtractTextPlugin( 'style.css' ),
		new webpack.NoEmitOnErrorsPlugin()
	]
});
