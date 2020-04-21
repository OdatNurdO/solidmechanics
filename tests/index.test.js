// This will search for files ending in .test.js and require them
// so that they are added to the webpack bundle
// https://stackoverflow.com/questions/32385219/mocha-tests-dont-run-with-webpack-and-mocha-loader
var context = require.context('.', true, /.+\.test\.js?$/);
context.keys().forEach(context);
module.exports = context;