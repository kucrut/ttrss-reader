var path = require("path");
var InlineEnviromentVariablesPlugin = require('inline-environment-variables-webpack-plugin');
var webpack = require("webpack");

var assetsPath = path.join(__dirname, "..", "public", "assets");
var appPath = path.join(__dirname, '..', 'app');
var publicPath = "/";

var commonLoaders = [
  {
    /*
     * TC39 categorises proposals for babel in 4 stages
     * Read more http://babeljs.io/docs/usage/experimental/
     */
    test: /\.js$|\.jsx$/,
    loader: 'babel',
    include: appPath,
    exclude: path.join(__dirname, '/node_modules/')
  },
  { test: /\.json$/, loader: "json-loader" },
  {
    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
    loader: 'url',
    query: {
        name: '[hash].[ext]',
        limit: 10000,
    }
  }
];

module.exports = [
  {
    // The configuration for the client
    name: "browser",
    // A SourceMap is emitted.
    devtool: "source-map",
    context: appPath,
    entry: {
      app: "./index"
    },
    output: {
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: "[name].js",
      // The output path from the view of the Javascript
      publicPath: publicPath

    },

    module: {
      loaders: commonLoaders
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.css'],
      modulesDirectories: [
        "app", "node_modules"
      ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false
          }
        }),
        new InlineEnviromentVariablesPlugin({ NODE_ENV: 'production' })
    ]
  }
];
