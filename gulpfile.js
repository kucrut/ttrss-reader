var gulp             = require( 'gulp' );
var gutil            = require( 'gulp-util' );
var sass             = require( 'gulp-sass' );
var cssmin           = require( 'gulp-cssmin' );
var rename           = require( 'gulp-rename' );
var webpack          = require( 'webpack' );
var WebpackDevServer = require( 'webpack-dev-server' );
var webpackConfig    = require( './webpack.config.js' );

gulp.task( 'default', [ 'webpack-dev-server', 'watch' ] );

gulp.task( 'webpack-dev-server', function( callback ) {
	// modify some webpack config options
	var myConfig     = Object.create( webpackConfig );
	myConfig.devtool = 'eval';
	myConfig.debug   = true;
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.HotModuleReplacementPlugin()
	);

	myConfig.entry.unshift( 'webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server' );

	// Start a webpack-dev-server
	new WebpackDevServer( webpack( myConfig ), {
		hot: true,
		publicPath: '/js/',
		stats: {
			colors: true
		}
	}).listen( 8080, 'localhost', function( err ) {
		if ( err ) {
			throw new gutil.PluginError( 'webpack-dev-server', err );
		}

		gutil.log( '[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html' );
	});
});

gulp.task( 'styles', function() {
	gulp.src( 'css/src/**/*.scss' )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( cssmin() )
		.pipe( rename({suffix: '.min'}) )
		.pipe( gulp.dest( './css/' ) )
});

gulp.task( 'watch', function() {
	gulp.watch( 'css/src/**/*.scss', [ 'styles' ] );
});
