var path = require( 'path' );
var webpack = require( 'webpack' );

module.exports = {
	plugins: [
		require( 'postcss-import' )({
			path: path.join( __dirname, 'app', 'css' ),
			// addDependencyTo is used for hot-reloading in webpack
			addDependencyTo: webpack
		}),
		require( 'postcss-fontpath' )(),
		require( 'postcss-mixins' )(),
		require( 'postcss-simple-vars' )(),
		// Unwrap nested rules like how Sass does it
		require( 'postcss-nested' )(),
		// parse CSS and add vendor prefixes to CSS rules
		require( 'autoprefixer' )({
			browsers: [ 'last 2 versions', 'IE > 8' ]
		}),
		// A PostCSS plugin to console.log() the messages registered by other
		// PostCSS plugins
		require( 'postcss-reporter' )({
			clearMessages: true
		})
	]
};
