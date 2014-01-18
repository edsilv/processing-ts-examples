
import PVector = require("../../../src/pvector");

class Mover {

	position: PVector;
	velocity: PVector;

	constructor(){
		this.position = new PVector(random(width), random(height));
    	this.velocity = new PVector(random(-10, 10), random(-10, 10));
	}

    update(): void{
    	this.position.add(this.velocity);
    }

    display(): void{
    	fill(0);
	    ellipse(this.position.x, this.position.y, 20);
    }

    checkEdges(): void{
    	if (this.position.x > width) {
			this.position.x = 0;
		} else if (this.position.x < 0) {
			this.position.x = width;
		}

		if (this.position.y > height) {
			this.position.y = 0;
		} else if (this.position.y < 0) {
			this.position.y = height;
		}
    }

}

export = Mover;