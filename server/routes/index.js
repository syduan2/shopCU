var express = require('express')
module.exports=function(app, mongoose){
  require('../models/items')(mongoose);
  var item = mongoose.model('Item');
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
    });
    item_instance.save(function(err, instance){
      res.send(instance.id)
    });
  });

  app.


};
