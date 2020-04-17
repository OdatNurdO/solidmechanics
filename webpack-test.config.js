module.exports = {
    entry: './test/test.js',
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