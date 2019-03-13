
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');


app.use(cors());
app.use(bodyParser.json());
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


//***********Webservices***********/

app.get('/', (req, res) => res.send("Welcome to rapidpredict !"));

app.post('/uploadscv', upload.any(), function (req, res) {

    console.log(req.files[0])
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({'status':'uploadSuccessful'}));
   
})


//**********************************/
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
