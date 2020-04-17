import {Rectangle, Circle, Composite, IBeam, ZBeam} from './shape.js';
import _ from 'lodash';
import nerdamer from 'nerdamer';

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
//addElement(0, 0, 50, 50, "#000000");

var e = nerdamer('diff(x^2+2*(cos(x)+x*x),x)');
console.log(e.text());
 
/*
let shapes = [];
// Top flange
shapes.push(new Rectangle(250/2, 38/2, 250, 38));
// Web
shapes.push(new Rectangle(250/2, (38*2+300)/2, 25, 300));
// Bottom flange
shapes.push(new Rectangle(250/2, 38/2 + 300 + 38, 150, 38));

console.log(composite.getArea());
console.log(composite.getIyy());
const composite = new Composite(shapes);*/
/* I-Beam test
const iBeam = new IBeam(25, 38, 376, 150, 250);
console.log(iBeam.getArea());
console.log(iBeam.getIyy());
iBeam.draw(ctx); */

const zBeam = new ZBeam(20, 30, 250, 100, 200);
zBeam.draw(ctx);

canvas.addEventListener("click", onClickCanvas);

function component() {
    const element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component());

function onClickCanvas(event) {
    console.log(event.x);
    console.log(event.y);
}

function onClickCalculate(event) {
    console.log("Calculate");
}
