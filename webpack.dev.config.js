const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:4444/__webpack_hmr&reload=true',
    path.resolve(__dirname, `./demo/index.tsx`)
  ],
  output: {
    path: path.resolve(__dirname),
    filename: 'main.bundle.js',
    publicPath: '/'
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      '@woodman': '../flash/web/woodman/dist'
    }
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
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|mp4)$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
//             emitFile: false
//             name: 'static/images/[name].[ext]'
          }
        }
      },
      {
        test: /\.woff|\.woff2|.eot|\.ttf/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 5000,
//             emitFile: false
//             name: 'static/font/[name].[ext]'
          }
        }
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({})
  ]
};
