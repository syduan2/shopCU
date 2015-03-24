var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  var kittySchema = mongoose.Schema({
    name: String
  })
  var Kitten = mongoose.model('Kitten', kittySchema)
  var silence = new Kitten({ name: 'swagkitten' })
  console.log(silence.name);
  silence.save(function (err, fluffy) {
    if (err) return console.error(err);
    console.log("yey");
  });
});
