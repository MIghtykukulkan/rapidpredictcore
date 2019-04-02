
const loadCSV = require('./load-csv');


  let { features, labels, testFeatures, testLabels } = loadCSV('./add.csv', {
    shuffle: true,
    splitTest:10,
    dataColumns: ['first', 'second'],
    labelColumns: ['third']
  });

//var headers = [ '﻿first', 'second', 'third\r' ]
  //console.log(headers, headers[0], headers.indexOf('first'))



  console.log("***",features, labels, testFeatures, testLabels)
