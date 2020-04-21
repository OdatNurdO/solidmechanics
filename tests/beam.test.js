import {Beam, Force, DOWN, UP, LEFT, RIGHT, FixedSupport, RollerSupport, DistributedForce, LinearDistributedForce, TriangleDistributedForce, Moment, PinJointSupport} from '../src/beam.js';
import { assertDoubles } from './test_util.js';

// Run all code to 5 precision points
let precision = 5;

describe('Simple Fixed Beam', function() {

    const beam = new Beam(5, 0, 0);
    beam.applyAction(new FixedSupport(0, 0, 'Fx', 'Fy', 'M'));
    beam.applyAction(new Force(5, 0, 10, DOWN));
    const sol = beam.solve()

    describe('#solve()', function() {
        it('Check it returns expected Fx', function() {
            assertDoubles(0, sol['Fx'], precision);
        });

        it('Check it returns expected Fy', function() {
            assertDoubles(10, sol['Fy'], precision);
        });

        it('Check it returns expected M', function() {
            assertDoubles(50, sol['M'], precision);
        });
    });

});

describe('Simply Supported Beam w/ 2 Distributed Loads', function() {

    const beam = new Beam(10, 0, 0);
    beam.applyAction(new RollerSupport(0, 0, 'Ay'));
    beam.applyAction(new RollerSupport(10, 0, 'By'));
    beam.applyAction(new DistributedForce(0, 10, '1200', DOWN));
    beam.applyAction(new DistributedForce(4, 10, '1600*(x - 4)/6', DOWN));
    const sol = beam.solve()
    
    describe('#solve()', function() {
        it('Check it returns expected Ay', function() {
            assertDoubles(6960, sol['Ay'], precision);
        });

        it('Check it returns expected By', function() {
            assertDoubles(9840, sol['By'], precision);
        });
    });

});

describe('Simply Supported Beam w/ 2 Distributed Loads', function() {

    const beam = new Beam(10, 0, 0);
    beam.applyAction(new RollerSupport(0, 0, 'Ay'));
    beam.applyAction(new RollerSupport(10, 0, 'By'));
    beam.applyAction(new DistributedForce(0, 10, '1200', DOWN));
    beam.applyAction(new DistributedForce(4, 10, '1600*(x - 4)/6', DOWN));
    const sol = beam.solve()
    
    describe('#solve()', function() {
        it('Check it returns expected Ay', function() {
            assertDoubles(6960, sol['Ay'], precision);
        });

        it('Check it returns expected By', function() {
            assertDoubles(9840, sol['By'], precision);
        });
    });

});

describe('Simply Supported Beam w/ 2 Distributed Loads Using Aliases', function() {

    const beam = new Beam(10, 0, 0);
    beam.applyAction(new RollerSupport(0, 0, 'Ay'));
    beam.applyAction(new RollerSupport(10, 0, 'By'));
    beam.applyAction(new LinearDistributedForce(0, 10, '1200', DOWN));
    beam.applyAction(new TriangleDistributedForce(4, 10, 0, 1600, DOWN));
    const sol = beam.solve()
    
    describe('#solve()', function() {
        it('Check it returns expected Ay', function() {
            assertDoubles(6960, sol['Ay'], precision);
        });

        it('Check it returns expected By', function() {
            assertDoubles(9840, sol['By'], precision);
        });
    });

});

describe('Simple Fixed Support Beam w/ 2 Distributed Loads, a moment and a point force using 2 aliases', function() {

    const beam = new Beam(5, 0, 0);
    beam.applyAction(new FixedSupport(0, 0, 'Ax', 'Ay', 'M'));
    beam.applyAction(new LinearDistributedForce(2.5, 5, 25000, UP));
    beam.applyAction(new TriangleDistributedForce(2.5, 5, 0, 35000, UP));
    beam.applyAction(new Moment(1, 0, 40000));
    beam.applyAction(new Force(4, 0, 50000, DOWN));
    const sol = beam.solve()
    
    describe('#solve()', function() {
        
        it('Check it returns expected Ax', function() {
            assertDoubles(0, sol['Ax'], precision);
        });

        it('Check it returns expected Ay', function() {
            assertDoubles(-56250, sol['Ay'], precision);
        });

        it('Check it returns expected M', function() {
            assertDoubles(-256666.667, sol['M'], precision);
        });
    });

});

describe('Simple Fixed Support Beam w/ 2 Distributed Loads, a moment and a point force using 1 alias', function() {

    const beam = new Beam(5, 0, 0);
    beam.applyAction(new FixedSupport(0, 0, 'Ax', 'Ay', 'M'));
    beam.applyAction(new TriangleDistributedForce(2.5, 5, 25000, 60000, UP));
    beam.applyAction(new Moment(1, 0, 40000));
    beam.applyAction(new Force(4, 0, 50000, DOWN));
    const sol = beam.solve()
    
    describe('#solve()', function() {
        
        it('Check it returns expected Ax', function() {
            assertDoubles(0, sol['Ax'], precision);
        });

        it('Check it returns expected Ay', function() {
            assertDoubles(-56250, sol['Ay'], precision);
        });

        it('Check it returns expected M', function() {
            assertDoubles(-256666.667, sol['M'], precision);
        });
    });

});

describe('Simply Supported Pin Joint w/ distributed load, force, and tension cord.', function() {

    const beam = new Beam(4, 0, 0);
    beam.applyAction(new PinJointSupport(0, 0, 'Ax', 'Ay'));
    beam.applyAction(new LinearDistributedForce(0, 2, 250, DOWN));
    beam.applyAction(new Force(2, 0, 500, DOWN));
    beam.applyAction(new Force(4, 0, 'T', 180 - Math.atan(3/4)*180/Math.PI));

    const sol = beam.solve()
    
    describe('#solve()', function() {
        
        it('Check it returns expected Ax', function() {
            assertDoubles(500, sol['Ax'], precision);
        });

        it('Check it returns expected Ay', function() {
            assertDoubles(625, sol['Ay'], precision);
        });

        it('Check it returns expected T', function() {
            assertDoubles(625, sol['T'], precision);
        });
    });

});