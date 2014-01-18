import PVector = require("../../../src/pvector");

class Oscillator {

    angle: PVector;
    velocity: PVector;
    amplitude: PVector;

    constructor() {
        this.angle = new PVector(0, 0);
        this.velocity = new PVector(random(-0.05, 0.05), random(-0.05, 0.05));
        this.amplitude = new PVector(random(20, width / 2), random(20, height / 2));
    }

    oscillate(): void {
        this.angle.add(this.velocity);
    }

    display(): void {

        var x = sin(this.angle.x) * this.amplitude.x;
        var y = sin(this.angle.y) * this.amplitude.y;

        pushMatrix();
        translate(width / 2, height / 2);
        stroke(0);
        strokeWeight(2);
        fill(127, 127);
        line(0, 0, x, y);
        ellipse(x, y, 32, 32);
        popMatrix();
    }
}

export = Oscillator;