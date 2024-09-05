const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
require("dotenv").config();
// const Dotenv = require("dotenv-webpack");
console.log(process.env);
module.exports = (env, argv) => {
  console.log("ENV:", process.env.NODE_ENV || "development"); // 打印出传入的环境变量
  // console.log('Mode:', argv.mode); // 打印出Webpack的mode值

  const isDev = process.env.NODE_ENV !== "production" ? true : false;
  return {
    entry: {
      index: "./src/index",
    },
    // publicPath: '/',
    plugins: [
      new MiniCssExtractPlugin({
        filename: isDev ? "[name].css" : "[name].[contenthash].css", // 使用 contenthash
      }),

      new HtmlWebpackPlugin({
        title: "video-downloader", // 用于设置生成的HTML文档的标题
        template: "public/index.html", // 模板文件路径
      }),
      new FaviconsWebpackPlugin("public/icon.png"), // svg works too!,
      new CleanWebpackPlugin(),
      // new Dotenv(),
      new webpack.EnvironmentPlugin({
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || "development",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.[cm]?(ts|js)x?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          use: [
            {
              loader: "file-loader",
              // options: {
              //   name: '[name].[hash].[ext]',
              //   outputPath: 'images',
              // },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx", ".css"],
      // Add support for TypeScripts fully qualified ESM imports.
      extensionAlias: {
        ".js": [".js", ".ts"],
        ".cjs": [".cjs", ".cts"],
        ".mjs": [".mjs", ".mts"],
      },
      fallback: {
        querystring: require.resolve("querystring-es3"),
      },
    },
    output: {
      filename: isDev ? "[name].js" : "[name].[contenthash].js", // 使用 contenthash 作为文件名的一部分
      chunkFilename: isDev ? "[name].js" : "[name].[contenthash].js", // 对于动态导入的模块
      path: path.resolve(__dirname, "build"),
    },
    mode: isDev ? "development" : "production",
    devtool: isDev ? "inline-source-map" : false,
    // cache: {
    //   type: 'filesystem', // 使用文件系统级别的缓存
    // },
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //   },
    // },
    devServer: {
      static: "./build", // 告诉服务器从哪里提供内容，通常是webpack的输出目录
      port: 9000, // 设置端口号，默认是8080
      open: false, // 告诉dev-server在服务器启动后打开浏览器
      hot: true, // 启用webpack的模块热替换特性（HMR）
      compress: true, // 启用gzip压缩
      historyApiFallback: true, // 当找不到路径的时候，默认加载index.html文件
      // more options...
    },
  };
};
