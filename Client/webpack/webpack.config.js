const path = require('path');
   const HtmlWebpackPlugin = require('html-webpack-plugin');
   const CopyWebpackPlugin = require('copy-webpack-plugin');

   module.exports = {
       entry: {
           background: './src/background.js',
           app: './src/content.js',
       },
       output: {
           filename: '[name].bundle.js',
           path: path.resolve(__dirname, 'dist'),
       },
       mode: 'development',
       watch: true,
       module: {
           rules: [
               {
                   test: /\.css$/,
                   use: ['style-loader', 'css-loader'],
               },
               {
                   test: /\.html$/,
                   use: 'html-loader',
               },
               {
                   test: /\.(png|svg|jpg|jpeg|gif)$/i,
                   use: [
                       {
                           loader: 'url-loader',
                           options: {
                               limit: 8192,
                               name: '[name].[hash].[ext]',
                               outputPath: 'images',
                               publicPath: 'images',
                           },
                       },
                   ],
               },
           ],
       },
       plugins: [
           new HtmlWebpackPlugin(),
           new CopyWebpackPlugin({
               patterns: [
                   { from: 'static', to: 'static' },
               ],
           }),
       ],
       resolve: {
           modules: [path.resolve(__dirname, 'src'), 'node_modules'],
       },
   };