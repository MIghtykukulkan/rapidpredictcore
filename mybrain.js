var brain = require('brain.js')

const config = {
    inputSize: 20,
    inputRange: 20,
    hiddenLayers: [20,20],
    outputSize: 20,
    learningRate: 0.01,
    decayRate: 0.999,
};

// create a simple recurrent neural network
const net = new brain.recurrent.LSTM(config);

net.train([{input: [1, 1], output: [1]},
           {input: [1, 2], output: [2]},
           {input: [1, 3], output: [3]},
           {input: [1, 4], output: [4]}]);

const output = net.run([1, 8]);  // [0]

console.log(output)