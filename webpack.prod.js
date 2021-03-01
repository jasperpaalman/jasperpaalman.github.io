const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode: "production",

  output: {
    path: path.resolve("./build/"),
    publicPath: "",
    filename: "static/js/[name].[fullhash].js",
    clean: true, // Clean the output directory before emit.
  },

  module: {
    rules: [
      // Send css to style-loader and css-loader
      {
        test: /\.(css|scss)$/,
        use: [
          {
            // 3. Inject styles into DOM
            loader: "style-loader",
          },
          {
            // 2. Translates CSS into CommonJS
            loader: "css-loader",
            options: {
              import: true,
              // modules: true,
              sourceMap: true,
            },
          },
          {
            // 1. Compiles Sass to CSS
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: "expanded",
              },
            },
          },
        ],
      },
    ],
  },

  // plugins: [
  //   new MiniCssExtractPlugin({
  //     filename: "static/css/[name].[fullhash].css",
  //   }),
  // ],
});
