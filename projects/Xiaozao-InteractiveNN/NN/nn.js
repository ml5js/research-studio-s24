class NeuralNetwork {
    constructor(input_n, hidden_n, output_n, x, y, w, h) {

        // visualization
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.ih_lines = [];
        this.ho_lines = [];

        this.state = 0;
        // state
        // this.stateMap = {
        //   0: 'inactive',
        //   1: 'input',
        //   2: 'hidden',
        //   3: 'output'
        // }

        this.input_n = input_n;
        this.hidden_n = hidden_n;
        this.output_n = output_n;
        this.lr = lr;

        this.currentData = null;

        this.weights_ih = new Matrix(this.hidden_n, this.input_n);
        this.weights_ho = new Matrix(this.output_n, this.hidden_n);
        this.weights_ih.randomize(); // -1 to 1
        this.weights_ho.randomize();

        this.bias_h = new Matrix(this.hidden_n, 1);
        this.bias_o = new Matrix(this.output_n, 1);
        this.bias_h.randomize();
        this.bias_o.randomize();

        // values (arrays)
        this.inputs = null;
        this.hidden = null;
        this.outputs = null;
        this.targets = null;
        this.errors = null;

        // set up sub-nodes
        // data point not defined, parameters randonly initialized
        this.input_nodes = [];

        for (let i = 0; i < input_n; i++) {
            let x = this.x;
            let y = this.y + this.h / (input_n + 1) * (i + 1);
            let new_node = new InputNode(x, y);
            this.input_nodes.push(new_node);
        }

        this.hidden_nodes = [];

        for (let i = 0; i < hidden_n; i++) {
            let x = this.x + this.w / 2;
            let y = this.y + this.h / (hidden_n + 1) * (i + 1);
            let new_node = new Perceptron(input_n, x, y);
            this.hidden_nodes.push(new_node);
            new_node.weights = this.weights_ih.data[i];
            new_node.bias = this.bias_h.data[i][0];
            
            // console.log('new_node', new_node);
        }

        this.output_nodes = [];

        for (let i = 0; i < output_n; i++) {
            let x = this.x + this.w;
            let y = this.y + this.h / (output_n + 1) * (i + 1);
            let new_node = new Perceptron(hidden_n, x, y);
            this.output_nodes.push(new_node);
            new_node.weights = this.weights_ho.data[i];
            new_node.bias = this.bias_o.data[i][0];
        }


        // store the lines
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            let node = this.hidden_nodes[i];
            for (let j = 0; j < this.input_nodes.length; j++) {
                let input_node = this.input_nodes[j];
                let line = [input_node.X+input_node.r/2, input_node.Y, node.X-node.r/2, node.Y]
                this.ih_lines.push(line);
            }
        }

        for (let i = 0; i < this.output_nodes.length; i++) {
            let node = this.output_nodes[i];
            for (let j = 0; j < this.hidden_nodes.length; j++) {
                let hidden_node = this.hidden_nodes[j];
                let line = [hidden_node.X+hidden_node.r/2, hidden_node.Y, node.X-node.r/2, node.Y]
                this.ho_lines.push(line);
            }
        }

    }

    feedforward(data_point) {

        this.currentData = data_point;
        console.log('currentData--', data_point);

        this.inputs = Matrix.fromArray(data_point.inputs);
        for (let i = 0; i < this.input_nodes.length; i++) {
            this.input_nodes[i].value = this.inputs.data[i][0];
        }

        this.hidden = Matrix.multiply(this.weights_ih, this.inputs);
        this.hidden.add(this.bias_h);
        this.hidden.map(sigmoid);
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            this.hidden_nodes[i].output = this.hidden.data[i][0];
        }
    
        this.outputs = Matrix.multiply(this.weights_ho, this.hidden);
        this.outputs.add(this.bias_o);
        this.outputs.map(sigmoid);
        for (let i = 0; i < this.output_nodes.length; i++) {
            this.output_nodes[i].output = this.outputs.data[i][0];
        }
    
        console.log('output', this.outputs.toArray());

        this.train();
        
    }

    proceed(state, highlighted) {
        this.state = state;
        // layer by layer, feedforward the data point
        if (this.state == 1) { 
            this.inputs = Matrix.fromArray(highlighted.inputs);
            for (let i = 0; i < this.input_nodes.length; i++) {
                this.input_nodes[i].value = this.inputs.data[i][0];
            }
        
        } else if (this.state == 2) {
            // highlighted is not needed, can be replaced by this.currentData
            this.inputs = Matrix.fromArray(highlighted.inputs);
            this.hidden = Matrix.multiply(this.weights_ih, this.inputs);
            this.hidden.add(this.bias_h);
            this.hidden.map(sigmoid);
            for (let i = 0; i < this.hidden_nodes.length; i++) {
                this.hidden_nodes[i].output = this.hidden.data[i][0];
            }
        } else if (this.state == 3) {
            this.outputs = Matrix.multiply(this.weights_ho, this.hidden);
            this.outputs.add(this.bias_o);
            this.outputs.map(sigmoid);
            for (let i = 0; i < this.output_nodes.length; i++) {
                this.output_nodes[i].output = this.outputs.data[i][0];
            }
            console.log('output', this.outputs.toArray());
        } 
    }


    train() {

        // ---------- Calculate output errors ----------
        
        this.targets = Matrix.fromArray(this.currentData.label);
        console.log('targets', this.targets.data);
        this.output_errors = Matrix.subtract(this.targets, this.outputs);
        errorArr.push(this.output_errors.data[0][0]);

        // update Perceptron objects
        for (let i = 0; i < this.output_nodes.length; i++) {
            console.log('output_errors', this.output_errors.data);
            this.output_nodes[i].error = this.output_errors.data[i][0];
        }


        // output layer adjustments
        console.log('-----------debugging');
        console.log('outputs', this.outputs.data);
        console.log('output_errors', this.output_errors.data);

        let bias_ho_deltas = Matrix.map(this.outputs, dsigmoid);
        bias_ho_deltas.multiply(this.output_errors);
        bias_ho_deltas.multiply(this.lr);

        let hidden_T = Matrix.transpose(this.hidden);
        let weights_ho_deltas = Matrix.multiply(bias_ho_deltas, hidden_T);

        console.log('weights_ho_deltas', weights_ho_deltas.data);
        console.log('bias_ho_deltas', bias_ho_deltas.data);

        this.weights_ho.add(weights_ho_deltas);
        this.bias_o.add(bias_ho_deltas);

        console.log('weights_ho', this.weights_ho.data);
        console.log('bias_o', this.bias_o.data);

        // update Perceptron objects
        for (let i = 0; i < this.output_nodes.length; i++) {
            this.output_nodes[i].bias_deltas = bias_ho_deltas.data[i][0];
            this.output_nodes[i].weights_deltas = weights_ho_deltas.data[i];
            this.output_nodes[i].weights = this.weights_ho.data[i];
            this.output_nodes[i].bias = this.bias_o.data[i][0];
            console.log('weights update', this.output_nodes[i].weights);
            console.log('bias update', this.output_nodes[i].bias);
        }


        // ------------ Calculate hidden layer errors (!!!) ------------
        let who_t = Matrix.transpose(this.weights_ho);
        this.hidden_errors = Matrix.multiply(who_t, this.output_errors);


        // hidden layer adjustments
        let bias_ih_deltas = Matrix.map(this.hidden, dsigmoid);
        bias_ih_deltas.multiply(this.hidden_errors);
        bias_ih_deltas.multiply(this.lr);

        let inputs_T = Matrix.transpose(this.inputs);
        let weights_ih_deltas = Matrix.multiply(bias_ih_deltas, inputs_T);

        this.weights_ih.add(weights_ih_deltas);
        this.bias_h.add(bias_ih_deltas);

        // update Perceptron objects
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            this.hidden_nodes[i].bias_deltas = bias_ih_deltas.data[i][0];
            this.hidden_nodes[i].weights_deltas = weights_ih_deltas.data[i];
            this.hidden_nodes[i].weights = this.weights_ih.data[i];
            this.hidden_nodes[i].bias = this.bias_h.data[i][0];
        }
    }

    draw() {

        // highlight the current state
        if (this.state == 1) {
            // highlight input layer nodes
            for (let i = 0; i < this.input_nodes.length; i++) {
                noStroke();
                fill(255, 255, 0);
                ellipse(this.input_nodes[i].X, this.input_nodes[i].Y, this.input_nodes[i].r + 10);
            }
        } else if (this.state == 2) {
            // highlight hidden layer nodes
            for (let i = 0; i < this.hidden_nodes.length; i++) {
                noStroke();
                fill(255, 255, 0);
                ellipse(this.hidden_nodes[i].X, this.hidden_nodes[i].Y, this.hidden_nodes[i].r + 10);
            }
        } else if (this.state == 3) {
            // highlight output layer nodes
            for (let i = 0; i < this.output_nodes.length; i++) {
                noStroke();
                fill(255, 255, 0);
                ellipse(this.output_nodes[i].X, this.output_nodes[i].Y, this.output_nodes[i].r + 10);
            }
        }

        // draw nodes
        stroke(0);
        strokeWeight(2);
        fill(255);
        for (let i = 0; i < this.input_nodes.length; i++) {
            ellipse(this.input_nodes[i].X, this.input_nodes[i].Y, this.input_nodes[i].r);
        }

        for (let i = 0; i < this.hidden_nodes.length; i++) {
            ellipse(this.hidden_nodes[i].X, this.hidden_nodes[i].Y, this.hidden_nodes[i].r);
        }

        for (let i = 0; i < this.output_nodes.length; i++) {
            ellipse(this.output_nodes[i].X, this.output_nodes[i].Y, this.output_nodes[i].r);
        }

        // draw connection lines
        for (let i = 0; i < this.ih_lines.length; i++) {
            line(this.ih_lines[i][0], this.ih_lines[i][1], this.ih_lines[i][2], this.ih_lines[i][3]);
        }

        for (let i = 0; i < this.ho_lines.length; i++) {
            line(this.ho_lines[i][0], this.ho_lines[i][1], this.ho_lines[i][2], this.ho_lines[i][3]);
        }

        // draw output line
        line(this.output_nodes[0].X + this.output_nodes[0].r/2, this.output_nodes[0].Y, this.output_nodes[0].X + this.output_nodes[0].r + 50, this.output_nodes[0].Y);

        // draw activation signs
        // rightward triangles attached on the right of the nodes
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            let node = this.hidden_nodes[i];
            let x = node.X + node.r/2;
            let y = node.Y;
            triangle(x+3, y - 7, x+3, y + 7, x + 13, y);
        }

        for (let i = 0; i < this.output_nodes.length; i++) {
            let node = this.output_nodes[i];
            let x = node.X + node.r/2;
            let y = node.Y;
            triangle(x+3, y - 7, x+3, y + 7, x + 13, y);
        }

        // draw error axis
        this.outputAxis = [this.output_nodes[0].X + 120, this.output_nodes[0].Y -30, this.output_nodes[0].X + 120, this.output_nodes[0].Y + 30];
        // console.log('axis', this.outputAxis);
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

        // draw error axis of hidden layer
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            let axisLength = 50;
            this.hiddenAxis = [this.hidden_nodes[i].X + 70, this.hidden_nodes[i].Y -axisLength/2, this.hidden_nodes[i].X + 70, this.hidden_nodes[i].Y + axisLength/2];
            stroke(0);
            strokeWeight(2);
            line(this.hiddenAxis[0], this.hiddenAxis[1], this.hiddenAxis[2], this.hiddenAxis[3]);
            line(this.hiddenAxis[0] - 4, this.hiddenAxis[1] +axisLength/2, this.hiddenAxis[0] + 4, this.hiddenAxis[1]+axisLength/2);
        }



        // draw text
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(14);
        text('Input layer', this.x, this.input_nodes[0].Y - 80);
        text('Hidden layer', this.x + this.w / 2, this.input_nodes[0].Y - 80);
        text('Output layer', this.x + this.w, this.input_nodes[0].Y - 80);

        // draw weights
        for (let i = 0; i < this.ih_lines.length; i++) {
            let line_fourth = [this.ih_lines[i][0] * 1/5 + this.ih_lines[i][2] * 4/5, this.ih_lines[i][1] * 1/5 + this.ih_lines[i][3] *4/5];
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            // very unorganized!!!!! need to be fixed
            if (i < 2) {
                text(this.hidden_nodes[0].weights[i].toFixed(2), line_fourth[0], line_fourth[1]-8);
            } else {
                text(this.hidden_nodes[1].weights[i-2].toFixed(2), line_fourth[0], line_fourth[1]-8);
            }   
        }

        for (let i = 0; i < this.ho_lines.length; i++) {
            let line_fourth = [this.ho_lines[i][0] * 1/5 + this.ho_lines[i][2] * 4/5, this.ho_lines[i][1] * 1/5 + this.ho_lines[i][3] *4/5];
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.output_nodes[0].weights[i].toFixed(2), line_fourth[0], line_fourth[1]-8);
        }

        // draw bias
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.hidden_nodes[i].bias.toFixed(2), this.hidden_nodes[i].X, this.hidden_nodes[i].Y + 40);
        }

        for (let i = 0; i < this.output_nodes.length; i++) {
            fill(0);
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.output_nodes[i].bias.toFixed(2), this.output_nodes[i].X, this.output_nodes[i].Y + 40);
        }
        
        // draw input values inside the node ellipse
        for (let i = 0; i < this.input_nodes.length; i++) {
            if (this.input_nodes[i].value) {
                fill(0);
                noStroke();
                textAlign(CENTER, CENTER);
                text(this.input_nodes[i].value.toFixed(2), this.input_nodes[i].X, this.input_nodes[i].Y);
            }
        }
        // draw output inside the node ellipse if it exists
        for (let i = 0; i < this.output_nodes.length; i++) {
            if (this.output_nodes[i].output) {
                fill(0);
                noStroke();
                textAlign(CENTER, CENTER);
                text(this.output_nodes[i].output.toFixed(2), this.output_nodes[i].X, this.output_nodes[i].Y);
            }
        }
        // hidden
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            if (this.hidden_nodes[i].output) {
                fill(0);
                noStroke();
                textAlign(CENTER, CENTER);
                text(this.hidden_nodes[i].output.toFixed(2), this.hidden_nodes[i].X, this.hidden_nodes[i].Y);
            }
        }

    }
    
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
      
function dsigmoid(y) {
    return y * (1 - y);
}  