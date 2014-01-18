import Sketch = require("../../../src/sketch");
import PVector = require("../../../src/pvector");

class BouncingBall extends Sketch{

	position: PVector;
	velocity: PVector;

    setup(): void{
    	this.position = new PVector(100, 100);
  		this.velocity = new PVector(2.5, 5);
    }

    draw(){
    	background(255);

		this.position.add(this.velocity);

		if ((this.position.x > width) || (this.position.x < 0)) {
			this.velocity.x = this.velocity.x * -1;
		}

		if ((this.position.y > height) || (this.position.y < 0)) {
			this.velocity.y = this.velocity.y * -1;
		}

		fill(0);
		ellipse(this.position.x, this.position.y, 20);
    }

}

export = BouncingBall;