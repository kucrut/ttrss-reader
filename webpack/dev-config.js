/* eslint-disable max-len */

const path = require( 'path' );
const webpack = require( 'webpack' );
const merge = require( 'webpack-merge' );
const sharedConfig = require( './shared.js' );

const appPath = path.join( __dirname, '..', 'app' );
// const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';
const PORT = process.env.PORT || 8080;

module.exports = merge( sharedConfig, {
	devtool: 'eval-source-map',
	entry: {
		app: [
			`webpack-dev-server/client?http://localhost:${PORT}`,
			'webpack/hot/dev-server',
			'./index'
		]
	},
	module: {
		rules: [{
			/*
			* TC39 categorises proposals for babel in 4 stages
			* Read more http://babeljs.io/docs/usage/experimental/
			*/
			test: /\.js$|\.jsx$/,
			loader: 'babel-loader',
			// Reason why we put this here instead of babelrc
			// https://github.com/gaearon/react-transform-hmr/issues/5#issuecomment-142313637
			options: {
				presets: ['react-hmre', 'es2015', 'react', 'stage-0'],
				plugins: ['transform-react-remove-prop-types']
			},
			include: appPath,
			exclude: path.join( __dirname, '/node_modules/' )
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						modules: true,
						importLoaders: 1,
						localIdentName: '[name]__[local]___[hash:base64:5]'
					}
				},
				'postcss-loader'
			]
		}]
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({ debug: true }),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
});
