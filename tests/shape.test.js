var assert = require('assert');
var shape = require('../src/shape');


// Run all code to 5 precision points
let precision = 5;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Number/toPrecision
function precise(x) {
    return Number.parseFloat(x).toPrecision(precision);
}

describe('Rectangle', function() {
    describe('#getIxx()', function() {
        it('Check it returns expected value for basic square', function() {
            const rectangle = new shape.Rectangle(5, 5, 10, 10);
            // Second moment of area is just bh^3/12, where b = base, h = height
            assert.equal(precise(rectangle.getIxx()), precise(10*10*10*10/12));
        });

        it('Check it returns expected value for basic rectangle', function() {
            const rectangle = new shape.Rectangle(5, 5, 10, 5);
            assert.equal(precise(rectangle.getIxx()), precise(10*5*5*5/12));
        });
    });

    describe('#getIyy()', function() {
        it('Check it returns expected value for basic square', function() {
            const rectangle = new shape.Rectangle(5, 5, 10, 10);
            // Second moment of area is just bh^3/12, where b = base, h = height
            assert.equal(precise(rectangle.getIyy()), precise(10*10*10*10/12));
        });

        it('Check it returns expected value for basic rectangle', function() {
            const rectangle = new shape.Rectangle(5, 5, 10, 5);
            // Second moment of area is the same as above but base and height are swapped as iyy is from the yy reference (vertical)
            assert.equal(precise(rectangle.getIyy()), precise(5*10*10*10/12));
        });

    });

    describe('#getIxy()', function() {
        it('Check it returns expected value for basic square', function() {
            const rectangle = new shape.Rectangle(5, 5, 10, 10);
            // Second moment of area for any shape with a axis of symmetry is zero
            assert.equal(precise(rectangle.getIxy()), 0);
        });

        it('Check it returns expected value for basic rectangle', function() {
            const rectangle = new shape.Rectangle(5, 5, 10, 5);
            // Second moment of area for any shape with a axis of symmetry is zero
            assert.equal(precise(rectangle.getIxy()), 0);
        });
        
    });
});