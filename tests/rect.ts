import graphics = require("../../src/pgraphics");
import Sketch = require("../../src/sketch");

class Rect extends Sketch{

	setup(): void{

	}

	draw(): void{
		background(225);

		fill(255, 0);
		stroke(0, 0, 255);
		rect(25, 25, 50, 50);

	}

}

export = Rect;