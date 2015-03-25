var express = require('express')
require('./models/items');
module.exports=function(app, mongoose){
  var item = mongoose.model('Item');
  app.get('/items', function(req, res, next) {
    item.find(function(err, items){
      if(err){ return next(err); }
      res.json(items);
    });
  });
};
