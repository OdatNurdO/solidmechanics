var nerdamer = require('nerdamer/all');

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

    solve () {
        console.log()
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
export class DistributedForce extends Force {
    
    constructor(startX, endX, fX, direction) {
        // Calculate x-centroid
        this.x = nerdamer('defint(' + fX + ',' + startX + ',' + endX + ',x)/defint(' + fX + ',' + startX + ','  + endX + ',' + 'x)');
        this.y = 0;
        this.fX = fX;
        this.magnitude = nerdamer('defint(' + fX + ',' + startX + ',' + endX +',x)');
        this.direction = direction;
    }

}

// Both moments and torques
export class Moment extends Action {
    constructor(x, y, magnitude) {
        super(x, y);
    }

    // Moments dont care about where we are summing.
    resolveMoment(about) {
        return magnitude;
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
        this.addConstraint(new Force(x, y, magnitudeX, UP));
        this.addConstraint(new Force(x, y, magnitudeY, RIGHT));
    }
}

// Fixed Support is a type of support that can supply a x and y direction reaction force and a moment.
export class FixedSupport extends Support {
    constructor(x, y, magnitudeX, magnitudeY, moment) {
        super(x, y);
        // 90 degrees is up
        this.addConstraint(new Force(x, y, magnitudeX, UP));
        this.addConstraint(new Force(x, y, magnitudeY, RIGHT));
        this.addConstraint(new Moment(x, y, moment));
    }
}