const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "web",

  entry: "./src/index.js",

  module: {
    rules: [
      // File loader for images
      {
        test: /\.(png|jpg)$/,
        include: path.join(__dirname, "src/assets/image"),
        loader: "file-loader",
        options: {
          name: "./static/image/[name].[ext]",
        },
      },

      // Semantic UI React loaders
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        exclude: /src/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "./static/media/[name].[ext]",
        },
      },
      {
        test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
        exclude: /src/,
        loader: "file-loader",
        options: {
          name: "./static/media/[name].[ext]",
        },
      },

      // Check js codestyle
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          quiet: true,
          fix: true,
        },
      },

      // Send js to babel\
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },

      // Load raw svg's
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: {
          loader: "raw-loader",
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./public/static/",
          to: "./static/",
        },
      ],
    }),
  ],

  devtool: "source-map", // add source map
};
