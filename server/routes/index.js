var mongoose = require('mongoose');
var express = require('express')
var router = express.Router();
var item = mongoose.model('Item');

router.get('/items', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(item);
  });
});
