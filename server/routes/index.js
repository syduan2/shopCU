var mongoose = require('mongoose');
var express = require('express')
var item = mongoose.model('Item');
module.exports=function(app, db){
  app.get('/items', function(req, res, next) {
    item.find(function(err, posts){
      if(err){ return next(err); }
      res.send("HELLO");
    });
  });
};
