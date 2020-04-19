module.exports = {
    entry: './test/index.js',
    output: {
      path: __dirname,
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /test\.js$/,
          use: 'mocha-loader',
          exclude: /node_modules/,
        },
      ],
    },
  };