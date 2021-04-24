module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    // alias: {
    //   react: path.resolve('./node_modules/react')
    // }
  };