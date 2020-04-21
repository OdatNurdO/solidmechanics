var assert = require('chai').assert
var should = require('chai').should()
var expect = require('chai').expect

export function assertDoubles(actual, expected, precision) {
    assert.isTrue(isNumeric(actual), actual + " is not numeric")
    assert.isTrue(isNumeric(expected), expected + " is not numeric")
    assert.equal(precise(actual, precision), precise(expected, precision));
}

export function precise(x, precision) {
    return Number.parseFloat(x).toPrecision(precision);
}

export function isNumeric(num) {
    return !isNaN(num);
}