
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const loadCSV = require('./load-csv');
const fs = require('fs');
const _ = require('lodash');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const KNN = require('./costknn');
const LINEAR = require('./linear-regression');

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


//***********Webservices***********/

app.get('/', (req, res) => res.send("Welcome to Rapidpredict !"));

app.post('/uploadcsv', upload.any(), function (req, res) {

    console.log(req.files[0])

    let data = fs.readFileSync(req.files[0].path, { encoding: 'utf-8' });
    data = _.map(data.split('\n'), d => d.split(','));
    data = _.dropRightWhile(data, val => _.isEqual(val, ['']));
    const headers = _.first(data);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({'status':'uploadSuccessful', 'path':req.files[0].path, 'headers':headers, 'data-size':data.length}));

   
});

app.post('/predict-knn',  function (req, res) {

  var body = req.body;
  console.log(JSON.stringify(body));
  var options = body.options;
  var predictionPoint = body.predictionPoint;
  /* {
      "kvalue": 10,
      "strategy":"OCC",
      "testSize": 50,
      "dataColumns":['horsepower', 'weight', 'displacement'],
       "labelColumns": ['mpg']
    };
    */

    if(options.testSize === undefined){
      options.testSize = 10;
    }
  let { features, labels, testFeatures, testLabels } = loadCSV('./'+body.path, {
    shuffle: true,
    splitTest: parseInt(options.testSize),
    dataColumns: options.dataColumns,
    labelColumns: options.labelColumns
  });


  console.log(features, labels, testFeatures, testLabels, predictionPoint, options)
  var prediction = new KNN(features, labels, testFeatures, testLabels, predictionPoint, options);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({'prediction':prediction.computeKnn(), "test_report":prediction.findAccuracy()}));


});


app.get('/predict-linear',  function (req, res) {

  //var body = req.body;
  //console.log(JSON.stringify(body));
  //var options = body.options;
  var predictionPoint = [11,11];
  var options = {
      "kvalue": 10,
      "strategy":"OCC",
      "testSize": 10,
      "dataColumns":['first', 'second'],
       "labelColumns": ['third']
    };
  


  let { features, labels, testFeatures, testLabels } = loadCSV('./add.csv', {
    shuffle: true,
    splitTest: options.testSize,
    dataColumns: options.dataColumns,
    labelColumns: options.labelColumns
  });

  var prediction = new LINEAR(features, labels, testFeatures, testLabels, predictionPoint, options);

  res.setHeader('Content-Type', 'application/json');
  //prediction.train();
  //console.log(prediction.test());
  res.end(JSON.stringify({'prediction':prediction.predict()}));


});



//**********************************/
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
