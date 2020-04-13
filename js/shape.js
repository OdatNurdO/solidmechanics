export class Shape {
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
}

export class Rectangle extends Shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width*this.height;
    }

    getIxx() {
        // Read https://en.wikipedia.org/wiki/Second_moment_of_area
        return this.width*this.height*this.height*this.height/12;
    }

    getIyy() {
        return this.width*this.width*this.width*this.height/12;
    }

    // For any symmetric shape it is 0
    getIxy() {
        return 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x - this.width/2, this.y-this.height/2, this.width, this.height);
        ctx.fillStyle = getRandomColor();
        ctx.fill();
        ctx.closePath();
    }

}

export class Circle extends Shape {

    constructor(x, y, radius) {
        super (x, y);
        this.radius = radius;
    }

    getArea() {
        return Math.PI*this.radius*this.radius;
    }

    getIxx() {
        return Math.PI*this.radius*this.radius*this.radius*this.radius/4;
    }

    getIxx() {
        return this.getIxx();
    }

    draw(ctx) {
        // TODO
    }

}

export class Composite extends Shape {
    constructor(shapes) {
        // Read https://en.wikipedia.org/wiki/Centroid
        let totalArea = 0;
        let totalWeightedCentroidsX = 0;
        let totalWeightedCentroidsY = 0;
        
        for (let shape of shapes) {
            const area = shape.getArea();
            totalWeightedCentroidsX += shape.getX()*area;
            totalWeightedCentroidsY += shape.getY()*area;
            totalArea += area;
        }
        super(totalWeightedCentroidsX/totalArea, totalWeightedCentroidsY/totalArea); // Bad practise? TODO
        this.shapes = shapes;
    }

    getArea() {
        let totalArea = 0;
        for (let shape of this.shapes) {
            totalArea += shape.getArea();
        }
        return totalArea;
    }

    getIxx() {
        // Read https://en.wikipedia.org/wiki/Second_moment_of_area
        // Uses parallel axis theorem
        let ixx = 0;
        for (let shape of this.shapes) {
            ixx += shape.getIxx() + shape.getArea()*(shape.getY()-this.getY())
        }
        return ixx;
    }

    getIyy() {
        let iyy = 0;
        for (let shape of this.shapes) {
            iyy += shape.getIyy() + shape.getArea()*(shape.getX()-this.getX())
        }
        return iyy;
    }

    getIxy() {
        console.log("Dont use yet");
        return 0;
    }

    draw(ctx) {
        for (let shape of this.shapes) {
            shape.draw(ctx);
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.fill();

    }

}

export class IBeam extends Composite {
    //      wTop
    // |-------------|
    //        b     
    // -------+-------   --  t
    //        |           |
    //        |           |
    //        |           |
    //        |           | h
    //        |           |
    //        |           |
    //        |           |
    //   -----+-----     --
    //   |---------|
    //       wBot

    // From https://en.wikipedia.org/wiki/I-beam
    // b - Web thickness
    // t - Flange thickness
    // h - height
    // wBot - Bottom flange width
    // wTop - Top flange width
    constructor(b, t, h, wBot, wTop = wBot) {
        
        // The thickness is the larger flange width
        const w = wBot > wTop ? wBot : wTop;

        const shapes = [];

        // Top flange
        shapes.push(new Rectangle(w/2, t/2, wTop, t));
        // Web
        shapes.push(new Rectangle(w/2, h/2, b, h - 2*t));
        // Bottom flange
        shapes.push(new Rectangle(w/2, h - t/2, wBot, t));

        super(shapes);
    }
}

export class ZBeam extends Composite {

    //           wTop
    //        |-------|
    //        b     
    //        +--------  --  t
    //        |           |
    //        |           |
    //        |           |
    //        |           | h
    //        |           |
    //        |           |
    //        |           |
    //   -----+          --
    //   |----|
    //    wBot

    // b - Web thickness
    // t - Flange thickness
    // h - height
    // wBot - Bottom flange width
    // wTop - Top flange width
    constructor (b, t, h, wBot, wTop=wBot) {
        
        const w = wTop + wBot - b;

        const shapes = [];

        // Top flange
        shapes.push(new Rectangle(wBot + wTop/2 - b, t/2, wTop, t));
        // Web
        shapes.push(new Rectangle(wBot-b/2, h/2, b, h - 2*t));
        // Bottom flange
        shapes.push(new Rectangle(wBot/2, h - t/2, wBot, t));

        super(shapes);
    }
}

// Random colour generator
// From https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}