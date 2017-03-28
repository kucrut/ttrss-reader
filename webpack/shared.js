module.exports = {
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
};
