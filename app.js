//Before calling node index.js
//Run the following: npm install express body-parser multer  --save
var express = require('express');
var path = require('path');
var jquery = require('jquery');

var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var routes = require('./routes/index');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;