// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/public/js/dashbroad.js", // Đường dẫn tới tệp JavaScript chính của bạn
  output: {
    filename: "bundle.js", // Tên tệp đầu ra
    path: path.resolve(`${__dirname}/src/public`, "dist"), // Thư mục đầu ra
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Sử dụng babel-loader nếu cần
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
