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

  var item_instance = new item({
    Name: "swag",
    img_link: "http://johancutych.com/img/posts/swag.png",
    views: 36,
  });
  item_instance.save()

  post.save(function(err, post){

};
