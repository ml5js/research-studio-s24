class Perceptron {
    constructor(input_n, x, y) {
      this.input_n = input_n;
      this.inputs = [];
      this.weight_n = this.input_n;
      this.activation = 'sigmoid';
      this.output = null;
      this.lr = lr;

      this.currentData = null;
      this.currentDisplay = null;

      // visualization
      this.x = x;
      this.y = y;
      this.r = 50;

      // state
      // this.stateMap = {
      //   0: 'inactive',
      //   1: 'display_input',
      //   2: 'display_sum',
      //   3: 'display_output'
      // }
      this.state = 0;

      this.initializeActivationGraph();
    }
    
    
    isUnder(mouseX, mouseY) {
      if (this.isIntersectingLine(this.inputLine_x, mouseX, mouseY)) {
        this.currentDisplay = 'weight_x';
        return true;
      } else {
        this.currentDisplay = null;
        return false;
      }
    }

    isIntersectingLine(segment, x, y) {
      let A = createVector(segment[0], segment[1]);
      let B = createVector(segment[2], segment[3]);
      let P = createVector(x, y);
      let AB = p5.Vector.sub(B, A);
      let AP = p5.Vector.sub(P, A);
      let theta = AP.angleBetween(AB);
      let AD_len = AP.mag() * cos(theta);
      if (AD_len < 0) { AD_len = 0; }
      if (AD_len > AB.mag()) { AD_len = AB.mag(); }
      let AB_normalized = AB.normalize();
      let AD = AB_normalized.mult(AD_len);
      let D = p5.Vector.add(A, AD);
      let distance = p5.Vector.dist(P, D);
      if (distance < 4) {
        console.log('intersecting');
        return true;
      } else {
        return false;
      }

    }

    proceed(state, data_point) {
      this.state = state;
      console.log('data',data_point)
      if (this.state == 1) {
        this.inputs = data_point.inputs;
      } else if (this.state == 2) {
        this.sum = 0;
        for (let i = 0; i < this.weight_n; i ++) {
          this.sum += this.weights[i] * this.inputs[i];
          this.sum += this.bias;
        }
      } else if (this.state == 3) {
        // this.output = sigmoid(this.sum);
        this.output = this.sum;
        this.error = data_point.label - this.output;
      }
        
    }


    // accelerated version
    feedforward(data_point) {
      this.inputs = this.currentData.inputs;
      // console.log('inputs', this.inputs);
      this.sum = 0;
      for (let i = 0; i < this.weight_n; i ++) {
        this.sum += this.weights[i] * this.inputs[i];
      }
      this.sum += this.bias;
      this.output = this.sum;
      this.train();
    }

    
    train() {
      // console.log('currentData', this.currentData);
      this.error = this.currentData.label - this.output;
      // console.log('error', this.error);
      errorArr.push(this.error);
      for (let i = 0; i < this.weights.length; i++) {
        this.weights[i] += this.lr * this.error * this.inputs[i];
      }
      this.bias += this.lr * this.error;
      // console.log('updated weights', this.weights);
      // console.log('updated bias', this.bias);
    }

    draw() {
      if (this.state == 0) { 
        this.drawInputlines();
        this.drawOutputLine();
        this.drawNode();
        this.drawOutputAxis();
      } else if (this.state == 1) {
        this.drawInputlines(true);
        this.drawInputs();
        this.drawOutputLine();
        this.drawNode();
        this.drawOutputAxis(); 
      } else if (this.state == 2) {
        this.drawInputlines();
        this.drawInputs();
        this.drawSumEquation();
        this.drawOutputLine();
        this.drawNode(true);
        this.drawOutputAxis(); 
      } else {
        this.drawInputlines();
        this.drawInputs();
        this.drawSumEquation();
        this.drawOutputLine(true);
        this.drawNode();
        this.drawOutputAxis(); 
        this.drawOutput();
      }

      
      
      this.drawWeights();
      this.drawBias();


      if (this.currentDisplay == 'weight_x' && this.inputs.length > 0) {
        let mid_x = (this.inputLine_x[0] + this.inputLine_x[2]) / 2;
        let mid_y = (this.inputLine_x[1] + this.inputLine_x[3]) / 2;
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.weights[0].toFixed(2), mid_x, mid_y-18); // for demo
      }


    }

    drawInputlines(highlight=false) {
        if (highlight) {
          strokeWeight(10);
          stroke(255,255,0);
          line(this.inputLine_x[0], this.inputLine_x[1], this.inputLine_x[2], this.inputLine_x[3]);
          line(this.inputLine_y[0], this.inputLine_y[1], this.inputLine_y[2], this.inputLine_y[3]);
        }
        strokeWeight(2);
        stroke(0);
        line(this.inputLine_x[0], this.inputLine_x[1], this.inputLine_x[2], this.inputLine_x[3]);
        line(this.inputLine_y[0], this.inputLine_y[1], this.inputLine_y[2], this.inputLine_y[3]);
    }

    drawOutputLine(highlight=false) {
      if (highlight) {
        strokeWeight(10);
        stroke(255,255,0);
        line(this.outputLine[0], this.outputLine[1], this.outputLine[2], this.outputLine[3])
      }
      strokeWeight(2);
      stroke(0);
      line(this.outputLine[0], this.outputLine[1], this.outputLine[2], this.outputLine[3])
    }

    drawNode(highlight=false) {
      if (highlight) {
        noFill();
        strokeWeight(10);
        stroke(255,255,0);
        ellipse(this.x, this.y, this.r+5, this.r+5);
      }
      stroke(0);
      strokeWeight(2);
      noFill();
      ellipse(this.x, this.y, this.r, this.r);
    }

    drawInputs() {
      let x = this.x - this.r - 32;
      let y1 = this.y - 30;
      let y2 = this.y + 30;
      fill(0);
      noStroke();
      textAlign(RIGHT, CENTER);
      text(this.inputs[0].toFixed(2) , x, y1);
      text(this.inputs[1].toFixed(2), x, y2);
    }

    drawWeights() {
      let mid_xline = [(this.inputLine_x[0] + this.inputLine_x[2]) / 2, (this.inputLine_x[1] + this.inputLine_x[3]) / 2];
      let mid_yline = [(this.inputLine_y[0] + this.inputLine_y[2]) / 2, (this.inputLine_y[1] + this.inputLine_y[3]) / 2];
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text(this.weights[0].toFixed(2), mid_xline[0], mid_xline[1]-8);
      text(this.weights[1].toFixed(2), mid_yline[0], mid_yline[1]-8);
    }

    drawBias() {
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text(this.bias.toFixed(2), this.x, this.y + this.r/2 + 10);
    }

    drawSumEquation() {
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      let sum_equation = `${this.weights[0].toFixed(2)} * ${this.inputs[0].toFixed(2)} + ${this.weights[1].toFixed(2)} * ${this.inputs[1].toFixed(2)} + ${this.bias.toFixed(2)} = ${this.sum.toFixed(2)}`;
      text(sum_equation, this.x, this.y+this.r/2+50);
    }

    initializeActivationGraph() {
        this.activationOrigin_x = this.x;
        this.activationOrigin_y = this.y + 200;
        this.activationScale = 10;
        let step = 1;
        this.activationVertices = [];
        for (let i = -10; i <= 10; i += step) {
          let px = this.activationOrigin_x + i * this.activationScale * 2;
          let py = this.activationOrigin_y - sigmoid(i) * this.activationScale * 10;
          this.activationVertices.push({ x: px, y: py });
        }
        console.log(this.activationVertices);
    }

    drawActivation() {
        // Draw sigmoid curve
        noFill();
        stroke(0);
        strokeWeight(2);
        beginShape();
        for (let point of this.activationVertices) {
          vertex(point.x, point.y);
        }
        endShape();
        // draw the axis
        line(this.activationOrigin_x - 200, this.activationOrigin_y, this.activationOrigin_x + 200, this.activationOrigin_y);
        line(this.activationOrigin_x, this.activationOrigin_y, this.activationOrigin_x, this.activationOrigin_y-200);

        // Draw data point
        let dataX = this.activationOrigin_x + this.output * this.activationScale * 2;
        let dataY = this.activationOrigin_y - sigmoid(this.output) * this.activationScale * 10;
        fill(255, 0, 0);
        noStroke();
        ellipse(dataX, dataY, 10, 10);

        // Projection to the axis
        noStroke();
        fill(0);
        text(this.sum.toFixed(2), dataX, this.activationOrigin_y + 10);
        text(this.output.toFixed(2), this.activationOrigin_x - 20, dataY);
        stroke(0);
        strokeWeight(1);
        line(dataX, dataY, this.activationOrigin_x, dataY);
        line(dataX, dataY, dataX, this.activationOrigin_y);
    }

    drawOutput() {
      let outputX = this.x + this.r + 50; 
      let outputMax = 1*this.weights[0] + 1*this.weights[1] + this.bias;
      let outputMin = 0*this.weights[0] + 0*this.weights[1] + this.bias;
      let outputY = map(this.output, 0, 1, this.y + 30, this.y - 30); // need to change!!! normalize and sigmoid
      let color = this.currentData.label == 1 ? [255, 0, 0] : [0, 0, 255];
      noFill();
      stroke(color);
      ellipse(outputX, outputY, 8, 8);

      // draw compare arrow
      if (this.error > 0) {
        // upward arrow
        let targetX = this.x + this.r + 50; 
        let targetY = this.currentData.label == 1 ? this.y - 30 : this.y + 30;
        line(outputX+10, outputY, targetX+10, targetY);
        line(targetX+10, targetY, targetX - 5 +10, targetY + 5);
        line(targetX+10, targetY, targetX + 5+10, targetY + 5);
      } else {
        // downward arrow
        let targetX = this.x + this.r + 50; 
        let targetY = this.currentData.label == 1 ? this.y - 30 : this.y + 30;
        line(outputX+10, outputY, targetX+10, targetY);
        line(targetX+10, targetY, targetX - 5+10, targetY - 5);
        line(targetX+10, targetY, targetX + 5+10, targetY - 5);
      }
    }

    drawOutputAxis() {
      this.outputAxis = [this.x + this.r + 50, this.y -30, this.x + this.r + 50, this.y + 30];
      stroke(0);
      strokeWeight(2);
      line(this.outputAxis[0], this.outputAxis[1], this.outputAxis[2], this.outputAxis[3]);
      line(this.outputAxis[0] - 4, this.outputAxis[1], this.outputAxis[0] + 4, this.outputAxis[1]);
      line(this.outputAxis[0] - 4, this.outputAxis[3], this.outputAxis[0] + 4, this.outputAxis[3]);
      textAlign(CENTER, CENTER);
      fill(0);
      noStroke();
      text("1", this.outputAxis[0] - 10, this.outputAxis[1]);
      text("0", this.outputAxis[0] - 10, this.outputAxis[3]);
      // Draw target point
      if (this.currentData) {
        let targetX = this.x + this.r + 50; 
        let targetY = this.currentData.label == 1 ? this.y - 30 : this.y + 30;
        let color = this.currentData.label == 1 ? [255, 0, 0] : [0, 0, 255];
        fill(color);
        noStroke();
        ellipse(targetX, targetY, 8, 8);
      }

    }
}
  

class InputNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 20;
    this.value = null;
  }

  draw() {
    if (this.value) {
      fill(0);
      noStroke();
      textAlign(CENTER, CENTER);
      text(this.value, this.x, this.y);
    }
  }

}





function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

    
