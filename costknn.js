
/*{"_id":"5c6a83e1310dd83f24aa1fd9","item_description":"window","material":"glass","damage_percentage":40,"cost_repair":10000,"location":"Jaipur","image_url":"","claimid":""}

// writing KNN classifcation problem for the prediction of the cost damages */

require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs')
var _ = require('lodash');
//-----------------------

class PredictCost {
  
    constructor(dataSet, predictionPoint){
        this.rawdata = dataSet;
        this.predictionPoint = predictionPoint;
        this.K = 2;

        this.data_prep(this.rawdata)
    }

   
    findIdealK(){
        //TODO
    }

    typeConvert(row){
        var tempArray = []    ;
            tempArray.push(this.funhash(row["item_description"]));
            tempArray.push(this.funhash(row["material"]));
            tempArray.push(row["damage_percentage"]);
            tempArray.push(this.funhash(row["location"]));
            return tempArray
    }

    funhash(s) {
        for(var i = 0, h = 0xdeadbeef; i < s.length; i++)
            h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
        return (h ^ h >>> 16) >>> 0;
    }


    //preparing feature array and label array and preparing the Tensor 
    data_prep(rawdata){
        let MLFeatureData = [];
        let MLlabelData = [];
        this.typeConvert(rawdata[0])
        _.forEach(rawdata, function(row){        
            MLlabelData.push([row["cost_repair"]])
            MLFeatureData.push(this.typeConvert(row))
        }.bind(this))

        this.features = tf.tensor(MLFeatureData);
        this.labels = tf.tensor(MLlabelData)
        this.predictionPoint = tf.tensor(this.typeConvert(this.predictionPoint))
    }

    splitDataSet(dataSet){
        [testData, traingData] = dataSet.splice(0,3) ;
        testData.forEach(row => {
            findIdealK(row)
        })
    }

    
    printTensor(){
        features.print();
        labels.print();
        predictionPoint.print()
    }

    // converts the string features to numeric values by hashing them
    
    
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
            .slice(0,this.K) // selecting the top K records
    
    //Now we have the top K records of tensors, 
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
        return this.predictedNumber
    }

    
    
  
}



var mydataset = [{"_id":"5c6a83e1310dd83f24aa1fj9","item_description":"window","material":"glass","damage_percentage":40,"cost_repair":10000,"location":"Jaipur","image_url":"","claimid":""},
                {"_id":"5c6a83e1310dd83f24aa1fd9","item_description":"window","material":"glass","damage_percentage":40,"cost_repair":20000,"location":"Mumbai","image_url":"","claimid":""},
                {"_id":"5c7a83e1310dd83f24aa1fd8","item_description":"window","material":"glass","damage_percentage":100,"cost_repair":100000,"location":"Mumbai","image_url":"","claimid":""},
                {"_id":"5c8a83e1310dd83f24aa1fj9","item_description":"window","material":"glass","damage_percentage":40,"cost_repair":10000,"location":"Jaipur","image_url":"","claimid":""},
                {"_id":"5c9a83e1310dd83f24aa1fd9","item_description":"pipe","material":"PVC","damage_percentage":50,"cost_repair":1000,"location":"Mumbai","image_url":"","claimid":""},
                {"_id":"5c6a83e1310dd83f24aa1fd8","item_description":"roof","material":"concrete","damage_percentage":90,"cost_repair":500000,"location":"Mumbai","image_url":"","claimid":""},
                {"_id":"5c6a83e1310dd83f24aa1fd9","item_description":"window","material":"glass","damage_percentage":40,"cost_repair":20000,"location":"Mumbai","image_url":"","claimid":""},
                {"_id":"5c7a83e1310dd83f24aa1fd8","item_description":"window","material":"glass","damage_percentage":100,"cost_repair":100000,"location":"Mumbai","image_url":"","claimid":""},
                {"_id":"5c8a83e1310dd83f24aa1fj9","item_description":"window","material":"glass","damage_percentage":40,"cost_repair":10000,"location":"Jaipur","image_url":"","claimid":""},
                {"_id":"5c9a83e1310dd83f24aa1fd9","item_description":"pipe","material":"PVC","damage_percentage":50,"cost_repair":1000,"location":"Mumbai","image_url":"","claimid":""},
                {"_id":"5c6a83e1310dd83f24aa1fd8","item_description":"roof","material":"concrete","damage_percentage":90,"cost_repair":500000,"location":"Mumbai","image_url":"","claimid":""}]

var predictFor = {"_id":"5c6a83e1310dd83f24aa1fd9","item_description":"window","material":"glass","damage_percentage":50,"cost_repair":0,"location":"Mumbai","image_url":"","claimid":""}


var prediction = new PredictCost(mydataset,predictFor)

var cost = prediction.computeKnn();

console.log("========> "+cost)