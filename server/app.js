var express = require('express')
var app = express()
	, server=require('http').createServer(app)
	, io=io.listen(server)
app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendfile('/public/index.html')
})

server.listen(80, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
