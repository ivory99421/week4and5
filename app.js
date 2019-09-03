var express = require('express');
var router = require('./routes/index');
let bodyParser = require('body-parser');
var morgan = require("morgan");


let app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/', router);
app.use(morgan('common'));
app.listen(8080);
console.log("Server running at http://localhost:8080");
