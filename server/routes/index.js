var express = require('express')
var ObjectID = require('mongodb').ObjectID;
module.exports=function(app, mongoose){
  require('../models/items')(mongoose);
  var item = mongoose.model('Item');
  var image = mongoose.model('Image');
  app.get('/items', function(req, res, next) {
    item.find(function(err, items){
      if(err){ return next(err); }
      res.json(items);
    });
  });

  app.get('/newPost', function (req, res) {

    var item_instance = new item({
      title: null,
      description: null,
      tag: null,
      price: null,
      negotiable: null,
      trade: null,
      email: null,
      phone: null,
      methods: {facebook: null,
                call: null,
                txtmsg: null,
                email: null},
      images: [null]
    });
    item_instance.save(function(err, instance){
      res.send(instance.id)
    });
  });

  app.post('/post-image', function(req, res){
    var fs = require('fs');
    //var bodyParser = require('body-parser')
    console.log()
    fs.writeFile("/tmp/test", JSON.stringify(req), function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file was saved!");
    });
    var image_instance = new image({
      //STORE IMAGE
    })
    res.send("success!");
    //RETURN ID AND STICK IT INTO THE ImAGES ARRAY IN OUR POST INSTANCE
  });


};
