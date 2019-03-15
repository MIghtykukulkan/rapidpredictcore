/*{"_id":"5c6a83e1310dd83f24aa1fd9","item_description":"window","material":"glass","damage_percentage":40,"cost_repair":10000,"location":"Jaipur","image_url":"","claimid":""}

// writing KNN classifcation problem for the prediction of the cost damages */
require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs')
var _ = require('lodash');
const loadCSV = require('./load-csv');
//-----------------------

class KNN {

    typeConvert(data) {
        var mainArray = []

        _.forEach(data, (row) => {

            var tempArray = [];
            for (var i in row) {
                if (typeof(row[i]) == String)
                    tempArray.push(this.funhash(row[i]));
                else
                    tempArray.push(row[i]);
            }
            mainArray.push(tempArray);

        });

        return tf.tensor(mainArray);
    }

    constructor(features, labels, testFeatures, testLabels, predictionPoint, options) {
        this.features = this.typeConvert(features);
        this.labels = tf.tensor(labels);
        this.predictionPoint = tf.tensor(predictionPoint);
        this.testFeatures = testFeatures;
        this.testLabels = testLabels;

        this.options = Object.assign({
                'kvalue': 3,
                'strategy':"OCC"
            },
            options
        );
    }

    funhash(s) {
        for (var i = 0, h = 0xdeadbeef; i < s.length; i++)
            h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
        return (h ^ h >>> 16) >>> 0;
    }

    printTensor() {
        this.features.print();
        this.labels.print();
        this.predictionPoint.print();
    }

    // converts the string features to numeric values by hashing them
    findAccuracy(){
        // formula = actual - precited / actual
        this.accuracyReport = [];
        this.testFeatures.forEach((item, index)=>{
            this.predictionPoint = item;
            var predictedValue = this.computeKnn()
            var accuracy = (this.testLabels[index][0] - predictedValue)/this.testLabels[index][0];
            this.accuracyReport.push({"actual":this.testLabels[index][0], "predicted":predictedValue, "accuracy-trend":accuracy});
        });
        return this.accuracyReport;
    }

    computeKnn() {

        let k_array = this.features
            .sub(this.predictionPoint) // subtracting each feature agains the prediction point
            .pow(2) // squaring them
            .sum(1) // summing them
            .pow(.5) // taking sqrt
            .expandDims(1) // expandind the dimension converting array to array of array
            .concat(this.labels, 1) // concating with labels inoder to sort
            .unstack() // converting whole tensor to array of tensors
            .sort((a, b) => a.get(0) > b.get(0) ? 1 : -1) // sort by distance 
            .slice(0, this.options.kvalue) // selecting the top K records

        //Now we have the top K records of tensors,
        if (this.options.strategy === "OCC") {
            this.predictedNumber = _.chain(k_array)
                .map(x => x.dataSync()) // takes data from tensor 
                .countBy() // counts the the repitative records and assigns a rank, for example {"[2312,123]":3}
                .toPairs() // converts array of objects to array of arrays
                .sortBy(row => row[1]) // sorting by rank
                .last() // taking the most frequent record
                .first() // taking the key i.e., data by skipping the rank
                .split(",") // since it is in string converting it to array
                .last() // taking the cost value i.e, the second item of the array
                .parseInt() // again converting the string to Integer
                .value() // returning it
        } else {
            var Sum = _.chain(k_array)
                .map(x => x.dataSync())
                .reduce(function(sum, obj) {
                    return sum + parseFloat(obj['1'])
                }, 0)
                .value();
            this.predictedNumber = Sum / k_array.length

        }
        //Now we have the top K records of tensors, 


        return this.predictedNumber
    }




}

module.exports = KNN;
