class NeuralNetwork {
    constructor(input_n, hidden_n, output_n, x, y, w, h) {

        // visualization
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;


        this.input_n = input_n;
        this.hidden_n = hidden_n;
        this.output_n = output_n;
        this.lr = lr;

        this.current_data = null;

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



    }

    feedforward(data_point) {

        this.current_data = data_point;

        this.inputs = Matrix.fromArray(data_point.inputs);

        this.hidden = Matrix.multiply(this.weights_ih, this.inputs);
        this.hidden.add(this.bias_h);
        this.hidden.map(sigmoid);
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            this.hidden_nodes[i].output = this.hidden.data[i][0];
        }
    
        this.output = Matrix.multiply(this.weights_ho, this.hidden);
        this.output.add(this.bias_o);
        this.output.map(sigmoid);
        for (let i = 0; i < this.output_nodes.length; i++) {
            this.output_nodes[i].output = this.output.data[i][0];
        }
    
        console.log('output', this.output.toArray());

        this.train();
        
        // return output.toArray();
    }

    step() {

    }


    train() {

        // ---------- Calculate output errors ----------
        this.targets = Matrix.fromArray(this.current_data.label);
        this.output_errors = Matrix.subtract(this.targets, this.outputs);

        // update Perceptron objects
        for (let i = 0; i < this.output_nodes.length; i++) {
            this.output_nodes[i].error = this.output_errors.data[i][0];
        }


        // output layer adjustments
        let bias_ho_deltas = Matrix.map(this.outputs, dsigmoid);
        bias_ho_deltas.multiply(this.output_errors);
        bias_ho_deltas.multiply(this.lr);

        let hidden_T = Matrix.transpose(this.hidden);
        let weights_ho_deltas = Matrix.multiply(bias_ho_deltas, hidden_T);

        this.weights_ho.add(weights_ho_deltas);
        this.bias_o.add(bias_ho_deltas);

        // update Perceptron objects
        for (let i = 0; i < this.output_nodes.length; i++) {
            this.output_nodes[i].bias_deltas = bias_ho_deltas.data[i][0];
            this.output_nodes[i].weights_deltas = weights_ho_deltas.data[i];
            this.output_nodes[i].weights = this.weights_ho.data[i];
            this.output_nodes[i].bias = this.bias_o.data[i];
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
            this.hidden_nodes[i].bias = this.bias_h.data[i];
        }
    }

    draw() {
        // input layer
        for (let i = 0; i < this.input_nodes.length; i++) {
            this.input_nodes[i].draw();
        }

        // hidden layer
        for (let i = 0; i < this.hidden_nodes.length; i++) {
            this.hidden_nodes[i].draw();
        }

        // output layer
        for (let i = 0; i < this.output_nodes.length; i++) {
            this.output_nodes[i].draw();
        }

        // draw connections

    }
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
  
      
function dsigmoid(y) {
    return y * (1 - y);
}  