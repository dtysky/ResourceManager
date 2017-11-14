const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, `./demo/index.tsx`),
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'main.bundle.js',
    publicPath: '/'
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"]
  },

  stats: {
    colors: true,
    reasons: true,
    errorDetails: true
  },

  devtool: false,

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'react-hot-loader/webpack'
          },
          {
            loader: "awesome-typescript-loader"
          },
          {
            loader: 'tslint-loader',
            query: {
              configFile: path.resolve(__dirname, './tslintConfig.js')
            }
          }
        ],
        exclude: /node_modules/
      },

      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", 'postcss-loader', 'sass-loader']
        }),
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'main.bundle.css',
      allChunks: true
    }),
    new webpack.ProvidePlugin({}),
    new webpack.DefinePlugin({
      'globalEnv': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true),
        PLAT: JSON.stringify(process.env.PLAT)
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      asset: "[path]",
      algorithm: "gzip",
      test: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
