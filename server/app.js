var express = require('express')
var app = express()
app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendfile('/public/index.html')
})

var server = app.listen(80, '54.148.216.53', function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
