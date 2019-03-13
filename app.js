
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');


app.use(cors());
app.use(bodyParser.json());


//***********Webservices***********/

app.get('/', (req, res) => res.send("Welcome to rapidpredict !"));


//**********************************/
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
