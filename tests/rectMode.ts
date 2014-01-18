import graphics = require("../../src/pgraphics");
import Sketch = require("../../src/sketch");

class RectMode extends Sketch{

	setup(): void{

	}

	draw(): void{
		background(225);

        rectMode(graphics.RectMode.CORNER); // Default rectMode is CORNER
		fill(255);  // Set fill to white
		rect(25, 25, 50, 50);  // Draw white rect using CORNER mode

		rectMode(graphics.RectMode.CORNERS); // Set rectMode to CORNERS
		fill(100);  // Set fill to gray
		rect(25, 25, 50, 50);  // Draw gray rect using CORNERS mode

		rectMode(graphics.RectMode.RADIUS); // Set rectMode to RADIUS
		fill(255);  // Set fill to white
		rect(50, 125, 25, 25);  // Draw white rect using RADIUS mode

		rectMode(graphics.RectMode.CENTER); // Set rectMode to CENTER
		fill(100);  // Set fill to gray
		rect(50, 125, 25, 25);  // Draw gray rect using CENTER mode
	}

}

export = RectMode;