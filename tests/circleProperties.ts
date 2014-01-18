import graphics = require("../../src/pgraphics");
import Sketch = require("../../src/sketch");
import PVector = require("../../src/pvector");

class CircleProperties extends Sketch{

    radius: number;

    setup(): void{
        this.radius = height * 0.25;
    }

    draw(): void{
        background(255);

        var center: PVector = new PVector(width/2, height/2);

        // Translate the origin point to the center of the screen
        translate(center.x, center.y);

        // draw circle
        stroke(0);
        ellipse(0, 0, this.radius);

        // draw a marker on the edge of the circle relative to the mouse position
        var mouse: PVector = new PVector(mouseX, mouseY);

        mouse.sub(center);
        mouse.normalize();

        // calculate the angle
        var angle = atan2(mouse.y, mouse.x) * -1;
        if (angle < 0) angle = Math.TAU + angle;

        var turn = angle / Math.TAU;

        mouse.mult(this.radius);

        line(0, 0, mouse.x, mouse.y);

        fill(0);
        ellipse(mouse.x, mouse.y, 4);

        translate(center.x * -1, center.y * -1);
        text(String(turn), 20, 20);
    }

}

export = CircleProperties;

// todo - use an oscillator to rotate using complex plane