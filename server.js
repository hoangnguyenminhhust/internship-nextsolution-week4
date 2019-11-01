var express = require('express')
var app = express(),
  port = process.env.port || 1002,
  mongoose = require('mongoose'),
  User = require('./app/models/user'),
  bodyParser = require('body-parser')

var controller = require('./app/controller/controller')
var router = require('./app/routes/routes')
// var config = require('./config')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/json-web-toke-demo', { useNewUrlParser: true })
mongoose.set('useFindAnhModify', false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

router(app)


app.listen(port);
console.log('server start on ' + port);