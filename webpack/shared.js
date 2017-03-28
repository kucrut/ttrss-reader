const path = require( 'path' );

const appPath = path.join( __dirname, '..', 'app' );
const assetsPath = path.join( __dirname, '..', 'public', 'assets' );

module.exports = {
	devtool: 'cheap-module-source-map',
	context: appPath,
	output: {
		// The output directory as absolute path
		path: assetsPath,
		// The filename of the entry chunk as relative path inside the output.path directory
		filename: '[name].js',
		// The output path from the view of the Javascript
		publicPath: '/assets/'
	},
	module: {
		rules: [{
			test: /\.html$/, loader: 'html-loader'
		}, {
			test: /\.json$/, loader: 'json-loader'
		}, {
			test: /\.(png|jpg|jpeg|gif|woff|woff2)/,
			loader: 'url-loader',
			options: {
				name: '[hash].[ext]',
				limit: 10000,
			}
		}, {
			test: /\.(otf|ttf|eot|svg)/,
			loader: 'file-loader',
			options: {
				name: '[hash].[ext]',
				limit: 10000,
			}
		}]
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css'],
		modules: ['app', 'node_modules']
	}
};
