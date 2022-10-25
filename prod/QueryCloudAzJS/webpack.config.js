const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './example/testQueryJPCJS.ts',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    proxy: {
      '/cas/token': {
        target: 'https://cc87-console.qapf1.qalab01.nextlabs.com/',
        changeOrigin: true,
        secure: false
      },
      '/dpc/authorization/pdp': {
        target: 'http://cc87-jpc.qapf1.qalab01.nextlabs.com:58080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Test'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};