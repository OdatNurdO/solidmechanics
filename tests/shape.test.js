var assert = require('assert');
var shape = require('../src/shape');
import {Rectangle, Composite, IBeam} from '../src/shape.js';
import {assertDoubles} from './test_util.js';

// Run all code to 5 precision points
let precision = 5;

describe('Rectangle', function() {

    const square = new Rectangle(5, 5, 10, 10);
    const rectangle10by5 = new Rectangle(5, 2.5, 10, 5);

    describe('#getIxx()', function() {
        it('Check it returns expected value for basic square', function() {
            // Second moment of area is just bh^3/12, where b = base, h = height
            assertDoubles(10*10*10*10/12, square.getIxx(), precision);
        });

        it('Check it returns expected value for basic rectangle', function() {
            assertDoubles(10*5*5*5/12, rectangle10by5.getIxx(), precision);
        });
    });

    describe('#getIyy()', function() {
        it('Check it returns expected value for basic square', function() {
            // Second moment of area is just bh^3/12, where b = base, h = height
            assertDoubles(10*10*10*10/12, square.getIyy(), precision);
        });

        it('Check it returns expected value for basic rectangle', function() {
            // Second moment of area is the same as above but base and height are swapped as iyy is from the yy reference (vertical)
            assertDoubles(5*10*10*10/12, rectangle10by5.getIyy(), precision);
        });

    });

    describe('#getIxy()', function() {
        it('Check it returns expected value for basic square', function() {
            // Second moment of area for any shape with a axis of symmetry is zero
            assertDoubles(0, square.getIxy(), precision);
        });

        it('Check it returns expected value for basic rectangle', function() {
            // Second moment of area for any shape with a axis of symmetry is zero
            assertDoubles(0, rectangle10by5.getIxy(), precision);
        });
        
    });

    describe('#getArea()', function() {
        it('Check it returns expected area for basic rectangle', function() {
            assertDoubles(10*10, square.getArea(), precision);
        });

        it('Check it returns expected value for basic rectangle', function() {
            assertDoubles(10*5, rectangle10by5.getArea(), precision);
        });
        
    });

    describe('#getX()', function() {
        it('Check it returns expected x centroid for a square', function() {
            assertDoubles(5, square.getX(), precision);
        });

        it('Check it returns expected x centroid for a rectangle', function() {
            assertDoubles(5, rectangle10by5.getX(), precision);
        });
        
    });

    describe('#getY()', function() {
        it('Check it returns expected y centroid for a square', function() {
            assertDoubles(5, square.getY(), precision);
        });

        it('Check it returns expected y centroid for a square', function() {
            assertDoubles(2.5, rectangle10by5.getY(), precision);
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
            assertDoubles(composite.getIxx(), 2*10*10*10*10/12 + 2*10*10*5*5, precision);
        });
    });

    describe('#getIyy()', function() {
        it('Check it returns expected Iyy', function() {
            assertDoubles(2*10*10*10*10/12 + 2*10*10*5*5, composite.getIyy(), precision);
        });

    });

    describe('#getIxy()', function() {
        it('Check it returns expected Ixy', function() {
            // Second moment of area for any shape with a axis of symmetry is zero
            // TODO
            assertDoubles(0, composite.getIxy(), precision);
        });
        
    });

    describe('#getArea()', function() {
        it('Check it returns expected area', function() {
            assertDoubles(2*10*10, composite.getArea(), precision);
        });
    });

    describe('#getX()', function() {
        it('Check it returns expected x centroid', function() {
            assertDoubles(10, composite.getX(), precision);
        });
    });

    describe('#getY()', function() {
        it('Check it returns expected y centroid', function() {
            assertDoubles(10, composite.getY(), precision);
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
            assertDoubles(474037947.7, iBeam.getIxx(), precision);
        });
    });

    describe('#getIyy()', function() {
        it('Check it returns expected Iyy', function() {
            assertDoubles(60557291.7, iBeam.getIyy(), precision);
        });

    });

    describe('#getIxy()', function() {
        it('Check it returns expected Ixy', function() {
            // Second moment of area for any shape with a axis of symmetry is zero
            assertDoubles(0, iBeam.getIxy(), precision);
        });
        
    });

    describe('#getArea()', function() {
        it('Check it returns expected area', function() {
            assertDoubles(22700, iBeam.getArea(), precision);
        });
    });

    describe('#getX()', function() {
        it('Check it returns expected x centroid', function() {
            assertDoubles(125, iBeam.getX(), precision);
        });
    });

    describe('#getY()', function() {
        it('Check it returns expected y centroid', function() {
            // Example has origin y at bottom.
            assertDoubles(216.2907, iBeam.getY(), precision);
        });
    });
});