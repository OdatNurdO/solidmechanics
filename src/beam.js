var nerdamer = require('nerdamer/all');
var _ = require('lodash');

// UP and RIGHT are the positive y and x respectively
export const UP = 90; 
export const RIGHT = 0;
export const DOWN = 270;
export const LEFT = 180;
// Anticlockwise is positive
export const CLOCKWISE = -1;
export const ANTI_CLOCKWISE = 1;

// A composition of Actions that can be solved.
export class Beam {
    
    constructor(length, crossSection, material) {
        
        this.material = material;
        this.length = length;
        this.crossSection = crossSection;
        this.actions = [];

    }

    solve() {
        // Only static cases
        nerdamer.set('SOLUTIONS_AS_OBJECT', true);
        const sumX = nerdamer(this.sumX() + "=0");
        const sumY = nerdamer(this.sumY() + "=0");
        // Should be optimised to sum moments about a point with force line of action going through it.
        // Simplifies solving something like ['Fy=0', '-10+Fx=0', '-2*Fx - 30 + M=0] to ['Fy=0', 'Fx-10=0']
        const sumMoments = nerdamer(this.sumMoments(0) + "=0");
        //console.log(sumMoments.toString())
        //console.log(sumX.toString())
        //console.log(sumY.toString())

        //console.log(this.sumX())
        //console.log(this.sumY())
        //console.log(this.sumMoments(0))

        let variables = _.union(sumX.variables(), sumY.variables(), sumMoments.variables());
        let equations = [sumX.toString(), sumY.toString(), sumMoments.toString()].filter((value) => value != '0=0');
        //console.log(equations)
        const sol = nerdamer.solveEquations(equations, variables);
        const retSols = {};
        for (let soln in sol) {
            // Has to be done to actually evaluate them - TODO put in another function
            retSols[soln] = nerdamer(sol[soln]).evaluate().text('decimals').toString();
            // console.log(sol[soln] + " -> " + retSols[soln]);
        }
        // console.log(retSols)
        return retSols;

    }
    
    sumX() {
        let sum = '0';
        this.actions.forEach(action => sum += '+' + action.resolveX());
        return sum;
    }


    sumY() {
        let sum = '0';
        this.actions.forEach(action => sum += '+' + action.resolveY());
        return sum;
    }

    sumMoments(about) {
        let sum = '0';
        this.actions.forEach(action => sum += '+' + action.resolveMoment(about));
        return sum;
    }

    applyAction(action) {
        this.actions.push(action);
    }

}

class Action {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    resolveX() {
        return '0';
    }

    resolveY() {
        return '0';
    }

    resolveMoment(about) {
        return '0';
    }
}

export class Force extends Action {
    
    constructor(x, y, magnitude, direction) {
        super(x, y);
        this.magnitude = magnitude;
        this.direction = direction;
    }

    resolveX() {
        return this.magnitude + "*" + "cos(" + this.direction + '*pi/180)';
    }

    resolveY() {
        return this.magnitude + "*" + "sin(" + this.direction + '*pi/180)';
    }

    resolveMoment(about) {
        return '(' + this.x + '-' + about  + ')*' + this.resolveY();
    }

}

// Force applied along some line from startX to endX with distribution function fX
export class FunctionForce extends Force {
    
    constructor(x, y, magnitude, direction, startX, endX, fX) {
        super(x, y, magnitude, direction);
        // console.log(this);
        this.fX = fX;
        this.startX = startX;
        this.endX = endX;
    }

}

export class DistributedForce extends FunctionForce {
    
    constructor(startX, endX, fX, direction) {
        // Calculate x-centroid
        let magnitude = nerdamer('defint(' + fX + ',' + startX + ',' + endX +',x)');
        let x = nerdamer('defint(x*' + fX + ',' + startX + ',' + endX + ',x)/' + magnitude);
        let y = 0;
        super(x, y, magnitude, direction, startX, endX, fX);
    }

}

export class LinearDistributedForce extends FunctionForce {
    constructor(startX, endX, magnitude, direction) {
        super(startX + (endX - startX)/2, 0, (endX-startX) * magnitude, direction, startX, endX, magnitude);
    }
}

export class TriangleDistributedForce extends FunctionForce {

    constructor(startX, endX, startMagnitude, endMagnitude, direction) {

        let magnitudeSquare = 0;
        let magnitudeTriangle = (startX - endX) * (startMagnitude - endMagnitude)/2;
        let xSquare = startX + (endX - startX)/2;
        let xTriangle = 0;
        // Centroid of a triangle is 1/3 from larger end
        if (startMagnitude > endMagnitude) {
            xTriangle = startX + (1/3)*(endX - startX);
            magnitudeSquare = endMagnitude * (endX - startX);
        } else {
            xTriangle = startX + (2/3)*(endX - startX);
            magnitudeSquare = startMagnitude * (endX - startX);
        }
        
        let magnitude = magnitudeSquare + magnitudeTriangle;
        let x = (xTriangle * magnitudeTriangle + xSquare * magnitudeSquare)/(magnitudeTriangle + magnitudeSquare);

        super(x, 0, magnitude, direction, startX, endX, "(" + startMagnitude + "+" + endMagnitude + ")*((" + startMagnitude + "-" + endMagnitude + ")/(" + startX + "-" + endX + "))");

    }

}

// Both moments and torques
export class Moment extends Action {
    constructor(x, y, magnitude) {
        super(x, y);
        this.magnitude = magnitude;
    }

    // Moments dont care about where we are summing.
    resolveMoment(about) {
        return this.magnitude;
    }
}

// Really just a composition of actions
class Support extends Action {
    constructor(x, y) {
        super (x, y);
        this.constraints = [];
    }

    // Takes in an action
    addConstraint(constraint) {
        this.constraints.push(constraint);
    }

    resolveX() {
        let sumX = '0';
        this.constraints.forEach(constraint => sumX += ('+' + constraint.resolveX()));
        return sumX;
    }

    resolveY() {
        let sumY = '0';
        this.constraints.forEach(constraint => sumY += ('+' + constraint.resolveY()));
        return sumY;
    }
    
    resolveMoment(about) {
        let sum = '0';
        this.constraints.forEach(constraint => sum += ('+' + constraint.resolveMoment(about)));
        return sum;
    }
}

// Roller Support is a type of support that only supplies a y reaction force on a beam
export class RollerSupport extends Support {
    constructor(x, y, magnitude) {
        super(x, y);
        // 90 degrees is up
        this.addConstraint(new Force(x, y, magnitude, UP));
    }
}

// Pin Joint Support is a type of support that can supply a x and y direction reaction force.
export class PinJointSupport extends Support {
    constructor(x, y, magnitudeX, magnitudeY) {
        super(x, y);
        // 90 degrees is up
        this.addConstraint(new Force(x, y, magnitudeX, RIGHT));
        this.addConstraint(new Force(x, y, magnitudeY, UP));
    }
}

// Fixed Support is a type of support that can supply a x and y direction reaction force and a moment.
export class FixedSupport extends Support {
    constructor(x, y, magnitudeX, magnitudeY, moment) {
        super(x, y);
        // 90 degrees is up
        this.addConstraint(new Force(x, y, magnitudeX, RIGHT));
        this.addConstraint(new Force(x, y, magnitudeY, UP));
        this.addConstraint(new Moment(x, y, moment));
    }
}