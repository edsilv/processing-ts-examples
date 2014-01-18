import graphics = require("../../src/pgraphics");
import Sketch = require("../../src/sketch");

class EllipseMode extends Sketch{

	setup(): void{

	}

	draw(): void{
		background(225);

		stroke(0);

		ellipseMode(graphics.EllipseMode.RADIUS);  // Set ellipseMode to RADIUS
		fill(255);  // Set fill to white
		ellipse(50, 50, 30, 30);  // Draw white ellipse using RADIUS mode

		ellipseMode(graphics.EllipseMode.CENTER);  // Set ellipseMode to CENTER
		fill(100);  // Set fill to gray
		ellipse(50, 50, 30, 30);  // Draw gray ellipse using CENTER mode

		ellipseMode(graphics.EllipseMode.CORNER);  // Set ellipseMode is CORNER
		fill(255);  // Set fill to white
		ellipse(25, 100, 50, 50);  // Draw white ellipse using CORNER mode

		ellipseMode(graphics.EllipseMode.CORNERS);  // Set ellipseMode to CORNERS
		fill(100);  // Set fill to gray
		ellipse(25, 100, 50, 50);  // Draw gray ellipse using CORNERS mode
	}

}

export = EllipseMode;