var brain = require('brain.js');
const { createCanvas, loadImage } = require('canvas')


require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');


const config = {
    inputSize: 20,
    inputRange: 20,
    hiddenLayers: [20,20],
    outputSize: 20,
    learningRate: 0.01,
    decayRate: 0.999,
};

// create a simple recurrent neural network
const net = new brain.recurrent.RNN(config);

loadImage('./images/image1.jpg').then((myimg)=>{    
        const canvas = createCanvas(myimg.width, myimg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(myimg,0,0);
        const imagedata = ctx.getImageData(0,0,myimg.width, myimg.height);
        
        net.train([{input: imagedata, output: [1]}]);

});

loadImage('./images/image2.jpg').then((myimg)=>{    
    const canvas = createCanvas(myimg.width, myimg.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(myimg,0,0);
    const imagedata = ctx.getImageData(0,0,myimg.width, myimg.height);
    
    
    const output = net.run(imagedata); 
    console.log(output); // [0]
});


