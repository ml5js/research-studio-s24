// Neural Networks
let NN;
let lr = 10;

// data field
let current_class = 'A';
let dataField;
let data_points = [];

// error field
let errorField;
let errorArr = [];
let trainCount = 0;

// interactive buttons
let AButton, BButton, stepButton, tweakButton;

// currently focusing on...
let highlighted; // data point
let selected_node;

let step_currentState = 0; // 0, 1, 2, 3, 4
  
  
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    NN = new NeuralNetwork(2, 2, 1, windowWidth/3-70, windowHeight/2-250, windowWidth/3, 400);
    dataField = new DataField(100, windowHeight/2-100, 200, 200);
    errorField = new ErrorField(windowWidth*3/4, windowHeight/2-100, 300, 200);
    AButton = new Button(100, windowHeight/2-120, 40, 20, 'A');
    BButton = new Button(140, windowHeight/2-120, 40, 20, 'B');
    stepButton = new Button(windowWidth/2-140, 100, 50, 25, 'Step');
    tweakButton = new Button(windowWidth/2-60, 100, 50, 25, 'Tweak');
    
}

function draw() {
    background(255);
    reactToHover();

    NN.draw();

    dataField.draw();
    for (let i = 0; i < data_points.length; i ++) {
        data_points[i].drawIn(dataField);
    }
    if (highlighted) {
        highlighted.highlightIn(dataField);
    }

    errorField.draw();

    // TODO: selected node

    AButton.drawButton();
    BButton.drawButton();
    stepButton.drawButton();
    tweakButton.drawButton();


}



function reactToHover() {
    if (AButton.isUnder(mouseX, mouseY)) {
        AButton.highlighted = true;
    } else {
        AButton.highlighted = false;
    }

    if (BButton.isUnder(mouseX, mouseY)) {
        BButton.highlighted = true;
    } else {
        BButton.highlighted = false;
    }

    // step 
    if (stepButton.isUnder(mouseX, mouseY)) {
        stepButton.highlighted = true;
    } else {
        stepButton.highlighted = false;
    }

    // tweak    
    if (tweakButton.isUnder(mouseX, mouseY)) {
        tweakButton.highlighted = true;
    } else {
        tweakButton.highlighted = false;
    }
}

function mousePressed() {


    if (dataField.isUnder(mouseX, mouseY)) {
        let label = current_class === 'A' ? 1 : 0;
        let dataPoint = new DataPoint(dataField, mouseX, mouseY, label);
        data_points.push(dataPoint);
        console.log(data_points);
    }



    if (AButton.isUnder(mouseX, mouseY)) {
        current_class = 'A';
        console.log(`Current class: ${current_class}`);

    }

    if (BButton.isUnder(mouseX, mouseY)) {
        current_class = 'B';
        console.log(`Current class: ${current_class}`);
    }

    if (stepButton.isUnder(mouseX, mouseY)) {
        NN.tweaking = false;
        console.log(`Current state: ${step_currentState}`);
        if (step_currentState == 0) {
            let idx = Math.floor(Math.random() * data_points.length);
            highlighted = data_points[idx];
            dataField.drawDataInfo(data_points[idx]);
            NN.currentData = data_points[idx];
            NN.state = 0;
        } else {
            NN.proceed(step_currentState, highlighted);
        }

        step_currentState += 1;
        if (step_currentState > 3) {
            step_currentState = 0;
        }

    }

    if (tweakButton.isUnder(mouseX, mouseY)) {
        console.log('Tweak');
        NN.tweaking = true;
        NN.train();
    }

}

function keyPressed() {
    if (keyCode == ENTER) {
        NN.tweaking = true;
        NN.state = 3;
        if (data_points.length > 0) {
            
            if (errorArr.length < 2000) {
                setInterval(train, 20);
                trainCount = 0;
                console.log('Finished training');
            }
    }
}


function train() {
        // console.log('Train one');
        trainCount += 1;
        if (trainCount < 20) {
            let idx = Math.floor(Math.random() * data_points.length);
            NN.currentData = data_points[idx];
            NN.feedforward(data_points[idx]);
        }
    

       
    }
}