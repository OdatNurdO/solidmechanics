var assert = require('assert');
var shape = require('../src/shape');


// Run all code to 5 precision points
let precision = 5;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Number/toPrecision
function precise(x) {
    return Number.parseFloat(x).toPrecision(precision);
}

describe('Rectangle', function() {

    const square = new shape.Rectangle(5, 5, 10, 10);
    const rectangle10by5 = new shape.Rectangle(5, 2.5, 10, 5);

    describe('#getIxx()', function() {
        it('Check it returns expected value for basic square', function() {
            // Second moment of area is just bh^3/12, where b = base, h = height
            assert.equal(precise(square.getIxx()), precise(10*10*10*10/12));
        });

        it('Check it returns expected value for basic rectangle', function() {
            assert.equal(precise(rectangle10by5.getIxx()), precise(10*5*5*5/12));
        });
    });

    describe('#getIyy()', function() {
        it('Check it returns expected value for basic square', function() {
            // Second moment of area is just bh^3/12, where b = base, h = height
            assert.equal(precise(square.getIyy()), precise(10*10*10*10/12));
        });

        it('Check it returns expected value for basic rectangle', function() {
            // Second moment of area is the same as above but base and height are swapped as iyy is from the yy reference (vertical)
            assert.equal(precise(rectangle10by5.getIyy()), precise(5*10*10*10/12));
        });

    });

    describe('#getIxy()', function() {
        it('Check it returns expected value for basic square', function() {
            // Second moment of area for any shape with a axis of symmetry is zero
            assert.equal(precise(square.getIxy()), 0);
        });

        it('Check it returns expected value for basic rectangle', function() {
            // Second moment of area for any shape with a axis of symmetry is zero
            assert.equal(precise(rectangle10by5.getIxy()), 0);
        });
        
    });

    describe('#getArea()', function() {
        it('Check it returns expected area for basic rectangle', function() {
            assert.equal(precise(square.getArea()), precise(10*10));
        });

        it('Check it returns expected value for basic rectangle', function() {
            assert.equal(precise(rectangle10by5.getArea()), precise(10*5));
        });
        
    });

    describe('#getX()', function() {
        it('Check it returns expected x centroid for a square', function() {
            assert.equal(precise(square.getX()), precise(5));
        });

        it('Check it returns expected x centroid for a rectangle', function() {
            assert.equal(precise(rectangle10by5.getX()), precise(5));
        });
        
    });

    describe('#getY()', function() {
        it('Check it returns expected y centroid for a square', function() {
            assert.equal(precise(square.getY()), precise(5));
        });

        it('Check it returns expected y centroid for a square', function() {
            assert.equal(precise(rectangle10by5.getY()), precise(2.5));
        });
        
    });
});

describe('Composite Shape: Two Squares', function() {

    let shapes = [];
    shapes.push(new shape.Rectangle(5, 5, 10, 10));
    shapes.push(new shape.Rectangle(15, 15, 10, 10));
    const composite = new shape.Composite(shapes)

    describe('#getIxx()', function() {
        it('Check it returns expected Ixx', function() {
            // Ixx = 2*bh^3 + 2*Ad^2
            assert.equal(precise(composite.getIxx()), precise(2*10*10*10*10/12 + 2*10*10*5*5));
        });
    });

    describe('#getIyy()', function() {
        it('Check it returns expected Iyy', function() {
            assert.equal(precise(composite.getIyy()), precise(2*10*10*10*10/12 + 2*10*10*5*5));
        });

    });

    describe('#getIxy()', function() {
        it('Check it returns expected Ixy', function() {
            // Second moment of area for any shape with a axis of symmetry is zero
            assert.equal(precise(composite.getIxy()), 0);
            console.log("TODO");
        });
        
    });

    describe('#getArea()', function() {
        it('Check it returns expected area', function() {
            assert.equal(precise(composite.getArea()), precise(2*10*10));
        });
    });

    describe('#getX()', function() {
        it('Check it returns expected x centroid', function() {
            assert.equal(precise(composite.getX()), precise(10));
        });
    });

    describe('#getY()', function() {
        it('Check it returns expected y centroid', function() {
            assert.equal(precise(composite.getY()), precise(10));
        });
    });
});

describe('Composite Shape: IBeam', function() {

    const iBeam = new shape.IBeam({
        topFlangeThickness: 38, 
        webThickness: 25,
        topFlangeWidth: 250,
        botFlangeWidth: 150,
        height: 300 + 38 + 38
    });
    
    // Refer to https://skyciv.com/docs/tutorials/section-tutorials/calculating-the-moment-of-inertia-of-a-beam-section/

    describe('#getIxx()', function() {
        it('Check it returns expected Ixx', function() {
            assert.equal(precise(iBeam.getIxx()), precise(474037947.7));
        });
    });

    describe('#getIyy()', function() {
        it('Check it returns expected Iyy', function() {
            assert.equal(precise(iBeam.getIyy()), precise(60557291.7));
        });

    });

    describe('#getIxy()', function() {
        it('Check it returns expected Ixy', function() {
            // Second moment of area for any shape with a axis of symmetry is zero
            assert.equal(precise(iBeam.getIxy()), 0);
        });
        
    });

    describe('#getArea()', function() {
        it('Check it returns expected area', function() {
            assert.equal(precise(iBeam.getArea()), precise(22700));
        });
    });

    describe('#getX()', function() {
        it('Check it returns expected x centroid', function() {
            assert.equal(precise(iBeam.getX()), precise(125));
        });
    });

    describe('#getY()', function() {
        it('Check it returns expected y centroid', function() {
            // Example has origin y at bottom.
            assert.equal(precise(iBeam.getY()), precise(216.2907));
        });
    });
});