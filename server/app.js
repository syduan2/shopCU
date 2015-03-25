var express = require('express')
var app = express()

//Database Stuff
var mongoose = require('mongoose');
require('./models/items');
require('./routes/index')
mongoose.connect('mongodb://localhost/items');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
require('./routes')(app, db);






app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendfile('/public/index.html')
})

var server = app.listen(80, '172.31.25.128', function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
