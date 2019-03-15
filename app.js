
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

app.use(cors());
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
    res.end(JSON.stringify({'status':'uploadSuccessful', 'path':req.files[0].path, 'headers':headers}));

   
});

app.post('/predict-knn',  function (req, res) {

  var body = req.body;
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


  let { features, labels, testFeatures, testLabels } = loadCSV(body.path, {
    shuffle: true,
    splitTest: options.testSize,
    dataColumns: options.dataColumns,
    labelColumns: options.labelColumns
  });


  var prediction = new KNN(features, labels, testFeatures, testLabels, predictionPoint, options);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({'prediction':prediction.computeKnn(), "test_report":prediction.findAccuracy()}));


});



//**********************************/
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
