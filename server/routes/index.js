var express = require('express')
var ObjectID = require('mongodb').ObjectID;
module.exports=function(app, mongoose){
  require('../models/items')(mongoose);
  var fs = require('fs');
  var multiparty = require('multiparty');
  var fs = require('fs');
  var util = require('util');
  bodyParser = require('body-parser')

  app.use(bodyParser.json());

  var item = mongoose.model('Item');
  var image = mongoose.model('Image');

  app.get('/items', function(req, res, next) {
    item.find(function(err, items){
      if(err){ return next(err); }
      items_out = [];
      for(var i=0; i<items.length && i<25; i++){

        if(items[i].title != null && items[i].images.length!=0){
          items_out.push(items[i]);
        }
      }
      res.json(items_out);
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
      images: []
    });
    item_instance.save(function(err, instance){
      res.send(instance.id)
    });
  });

  app.post('/post-image', function(req, res){
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, file){
        if (err) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.end("invalid request: " + err.message);
            return;
        }
        var image_instance = new image({
          //STORE IMAGE
        })
        image_instance.data = fs.readFileSync(file.file[0].path);
        image_instance.save(function(err, instance){
          item.find({ _id: fields.id}, function(err, item_instances){
            item_instances[0].images.push(instance.id);
            item_instances[0].save();
          });
          res.send("success!");
        });
    });
  });
  app.post('/submit', function(req, res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, file){
      //console.log(req.body.methods);

      item.find({ _id: mongoose.Types.ObjectId(req.body.id)}, function(err, instances){
        instances[0].title = req.body.title;
        instances[0].description = req.body.description;
        instances[0].price = req.body.price;
        instances[0].trade = req.body.trade;
        instances[0].negotiable = req.body.negotiable;
        instances[0].email = req.body.email;
        instances[0].phone = req.body.phone;
        instances[0].methods = {facebook: req.body.methods.facebook,
          call: req.body.methods.call,
          txtmsg: req.body.methods.txtmsg,
          email: req.body.methods.email};
        instances[0].id = req.body.id;
        instances[0].save();
      });

    });
    res.send("success!");
  });
  app.get('/img/:id', function(req,res){
    image.find({ _id: mongoose.Types.ObjectId(req.params.id)}, function(err, instance){
      res.send(instance[0].data);
    });
  });
  app.get('/post/:id', function(req,res){
    item.find({ _id: mongoose.Types.ObjectId(req.params.id)}, function(err, instance){
      res.send(instance[0]);
    })
  });
};
