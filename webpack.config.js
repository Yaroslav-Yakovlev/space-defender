import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import Dotenv from 'dotenv-webpack'

const isProduction = process.env.NODE_ENV === 'production'

export default {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist'),
    publicPath: isProduction ? '/space-defender/' : '/'
  },
  devServer: {
    static: [
      {
        directory: path.resolve('public'),
        publicPath: '/'
      },
      {
        directory: path.resolve('src/styles'),
        publicPath: '/src/styles'
      }
    ],
    open: true,
    port: 3000,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      templateParameters: {
        PUBLIC_PATH: process.env.PUBLIC_PATH || '/'
      }
    }),
    new CleanWebpackPlugin(),
    new Dotenv()
  ]
}
