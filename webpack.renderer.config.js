const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/renderer/index.jsx",
  output: {
    path: path.resolve(__dirname, "src/renderer"),
    filename: "renderer.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react"
            ],
          },
        },
      },
    ],
  },
  devtool: "source-map",
  target: "electron-renderer",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'themes'), to: 'themes' }
      ]
    })
  ],
};
