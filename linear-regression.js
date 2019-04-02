const tf = require('@tensorflow/tfjs');
const _ = require('lodash');

class LinearRegression {
  constructor(features, labels, testFeatures, testLabels, predictionPoint, options) {
    console.log("processing features")
    this.features = this.processFeatures(features);
    
    console.log("feature coloumns")
    this.features.print();

    this.labels = tf.tensor(labels);
    this.mseHistory = [];
    console.log("processing testfeatures",testFeatures)
    this.testFeatures = this.processFeatures(testFeatures);
    this.testLabels = tf.tensor(testLabels);
    this.predictionPoint = [predictionPoint];


    this.options = Object.assign(
      //iterations are put here to avaoid everrunning loop if the algorithm doesnt reach the MSP
      { learningRate: 0.1, iterations: 1000, batchSize: 5 },
      options
    );

    this.weights = tf.zeros([this.features.shape[1], 1]);
  }

  gradientDescent(features, labels) {
    //weights is m and b in a tensor
    //features.print()
    //this.weights.print()
    const currentGuesses = features.matMul(this.weights);
    //console.log("currentGuesses");
    //currentGuesses.print();
    const differences = currentGuesses.sub(labels);

    const slopes = features
      .transpose()
      .matMul(differences)
      .div(features.shape[0]);

    this.weights = this.weights.sub(slopes.mul(this.options.learningRate));
    //this.weights.print();    
  }

  train() {
    const batchQuantity = Math.floor(
      this.features.shape[0] / this.options.batchSize
    );
    this.features.print();
    console.log(this.options.batchSize,this.options.iterations )
    for (let i = 0; i < this.options.iterations; i++) {
      for (let j = 0; j < batchQuantity; j++) {
        const startIndex = j * this.options.batchSize;
        const { batchSize } = this.options;

        const featureSlice = this.features.slice(
          [startIndex, 0],
          [batchSize, -1]
        );

        //console.log(featureSlice)
        const labelSlice = this.labels.slice([startIndex, 0], [batchSize, -1]);
          //
        
          //console.log("*****")
          //featureSlice.print();
          //labelSlice.print()
        this.gradientDescent(featureSlice, labelSlice);
      }

      this.recordMSE();
      this.updateLearningRate();
    }
  }

  predict() {

    // prediction = mx + b
    //for multivariant p = b + (m1+x) + (m2+x) + (m3+x)
    //console.log(this.predictionPoint)
    
    this.train();
    console.log("processing prediction point")
    var prediction =  this.processFeatures(this.predictionPoint).matMul(this.weights);
    prediction.print();
    this.weights.print();
    return prediction.dataSync()[0];
  }

  test() {
    
    //testFeatures = this.processFeatures(this.testFeatures);
    //testLabels = tf.tensor(this.testLabels);

    const predictions = this.testFeatures.matMul(this.weights);

    const res = this.testLabels
      .sub(predictions)
      .pow(2)
      .sum()
      .get();
    const tot = this.testLabels
      .sub(this.testLabels.mean())
      .pow(2)
      .sum()
      .get();

    return 1 - res / tot;
  }

  processFeatures(features) {
    //console.log(features)
    features = tf.tensor(features);
    
    if (this.mean && this.variance) {
      console.log("applyintg the mean and variance")
      features = features.sub(this.mean).div(this.variance.pow(0.5));
      features.print()
    } else {
      console.log("standardizing")
      features = this.standardize(features);
    }

    features = tf.ones([features.shape[0], 1]).concat(features, 1);

    return features;
  }

  standardize(features) {
    
    const { mean, variance } = tf.moments(features, 0);
    console.log("mean:", mean, "variance", variance);
    this.mean = mean;
    this.variance = variance;

    return features.sub(mean).div(variance.pow(0.5));
  }

  recordMSE() {
    const mse = this.features
      .matMul(this.weights)
      .sub(this.labels)
      .pow(2)
      .sum()
      .div(this.features.shape[0])
      .get();

    this.mseHistory.unshift(mse);
  }

  updateLearningRate() {
    if (this.mseHistory.length < 2) {
      return;
    }

    if (this.mseHistory[0] > this.mseHistory[1]) {
      this.options.learningRate /= 2;
    } else {
      this.options.learningRate *= 1.05;
    }
  }
}

module.exports = LinearRegression;
