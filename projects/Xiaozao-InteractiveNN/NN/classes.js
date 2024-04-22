class DataField {
    constructor(x,y,w,h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.origin = createVector(this.x, this.y+h);
      this.pointBeingActivated = null;
    }
    
    draw() {
        // border
        stroke(0);
        fill(255);
        rect(this.x, this.y, this.w, this.h);
        // origin
        fill(0);
        noStroke();
        textAlign(RIGHT, CENTER);
        text('0', this.x-10, this.y + this.h);
        // draw coordinates of the current data point
        if (this.pointBeingActivated) {
            let x = map(this.pointBeingActivated.x, 0, 1, this.x, this.x + this.w);
            let y = map(this.pointBeingActivated.y, 0, 1, this.y+this.h, this.y);
            stroke(0);
            line(x, y, x, this.y + this.h);
            line(x, y, this.x, y);
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.pointBeingActivated.x.toFixed(2), x, this.y + this.h + 10);
            textAlign(RIGHT, CENTER);
            text(this.pointBeingActivated.y.toFixed(2), this.x - 10, y);


            textAlign(CENTER, CENTER);
            text(`x: ${this.pointBeingActivated.x.toFixed(2)}  y: ${this.pointBeingActivated.y.toFixed(2)}  target: ${this.pointBeingActivated.label}`, this.x + this.w/2, this.y + this.h + 30);

        }


    }
    
    isUnder(mouseX, mouseY) {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            return true;
        } else {
            return false;
        }
    }

    drawDataInfo(dataPoint) {
        this.pointBeingActivated = dataPoint;        
    }

}


class ErrorField {
    constructor(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        // border
        noFill();
        stroke(0);
        rect(this.x, this.y, this.w, this.h);
        // lr text
        noStroke();
        fill(0);
        textAlign(LEFT, CENTER);
        text(`lr: ${lr}`, windowWidth*3/4, windowHeight/2+120); 
        

        // draw error
        
        let gap = this.w / errorArr.length;
        beginShape();
        noFill();
        stroke(0);
        strokeWeight(1);
        for (let i = 0; i < errorArr.length; i++) {
            let x = this.x + i * gap;
            let y = this.y + this.h - abs(errorArr[i]) * 200;
            vertex(x, y);
        }
        endShape();
    }
}


class DataPoint {
    constructor(field, mouseX, mouseY, label) {
        this.localX = mouseX - field.origin.x; // local position inside the data field
        this.localY = field.origin.y - mouseY;
        this.x = map(this.localX, 0, field.w, 0, 1); // actual value
        this.y = map(this.localY, 0, field.h, 0, 1);
        this.inputs = [this.x, this.y];
        this.label = [label];
    }

    drawIn(field) {
        noStroke();
        if (this.label == 1) {
            fill(255,0,0);
        } else {
            fill(0,0,255);
        }
        ellipse(field.origin.x + this.localX, field.origin.y - this.localY, 8, 8);
    }

    highlightIn(field) {
        noFill();
        stroke(0);
        ellipse(field.origin.x + this.localX, field.origin.y - this.localY, 13, 13);
    }

}


class Button {
    constructor(x,y,w,h,label) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.label = label;
      this.highlighted = false;
    }

    drawButton() {
        stroke(0);
        strokeWeight(2);
        let color = this.highlighted ? [255,255,0] : [255,255,255];
        fill(color);
        rect(this.x, this.y, this.w, this.h);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.label, this.x + this.w/2, this.y + this.h/2);
    }

    isUnder(mouseX, mouseY) {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            return true;
        } else {
            return false;
        }
    }


}