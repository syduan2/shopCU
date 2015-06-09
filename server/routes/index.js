var express = require('express')
var session = require('express-session');
var flash = require('connect-flash');
var router = express.Router();

//var ObjectID = require('mongodb').ObjectID;
module.exports=function(app, mongoose){
  require('../models/items')(mongoose);
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var fs = require('fs');
  var multiparty = require('multiparty');
  var util = require('util');
  bodyParser = require('body-parser')

  app.use(bodyParser.json());

  var item = mongoose.model('Item');
  var image = mongoose.model('Image');
  var User = mongoose.model('User');

  app.use(express.static('public'));
  //app.use(cookieParser());
 // app.use(session({ secret: 'keyboard cat' }));
  app.use(session({secret:'come shop',resave: true, saveUninitialized: false}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());


  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) {
          console.log("err");
          return done(err);
        }
        if (!user) {
          console.log("No user with this email");
          return done(null, false, { message: 'Incorrect email.' });
        }

        var bcrypt = require('bcrypt');
        if (!bcrypt.compareSync(password, user.password)) { console.log("Wrong password");
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));


  //Serialize and Deserialize user functions provided so that passport knows
  //how to access the user
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err);
      // Redirect if it fails
      if (!user){
        console.log('info: '+info);
        return res.status(200).json(info);
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        // Redirect if it succeeds
        return res.status(200).json({message: 'Logged in',"data": user.name});
      });
    })(req, res, next);

  });

  //Homepage - retrieve top items
  //needs fixing for a real algorithm that sorts....
  app.get('/items', function(req, res, next) {
    item.find(req.query.where).sort(req.query.sort).skip(req.query.skip).limit(req.query.limit).exec(function(err, items){
      if(err){ return next(err); }
      items_out = [];
      for(var i=0; i<items.length; i++){
        items_out.push(items[i]);
      }
      item.find(req.query.where).count().exec(function(err, count){
        return res.status(200).json({message: 'items got',"data": items_out, size: count});
      });
    });
    console.log(req.user);
  });

  app.get('/users', function(req, res, next) {
    User.find(req.query.where).sort(req.query.sort).skip(req.query.skip).limit(req.query.limit).exec(function(err, users){
      if(err){ return next(err); }
      Users_out = [];
      for(var i=0; i<users.length; i++){
        Users_out.push(users[i]);
      }
      User.find(req.query.where).count().exec(function(err, count){
        return res.status(200).json({message: 'users got',"data": Users_out, size: count});
      });
    });
  });

  app.get('/collections', function(req, res, next) {
      //console.log(mongoose.connection.db);
      //console.log("count:    "+mongoose.connection.db.count);
      mongoose.connection.db.collections(function(err, collections){
        if(err){ res.status(500).json({message: 'Collections not retrieved',"data":[]}); return next(err);}
        Colle_out = [];
          for (var x in collections){
            //console.log(((collections[x]).s).name);
            Colle_out.push(((collections[x]).s).name);
          }
          //console.log(collections.length);
        /*for(var i=0; i<collections.length; i++){
            //console.log(collections[i]);
          if(collections[i].name != null){
            Colle_out.push(collections[i]);
          }
        }*/
        return res.status(200).json({message: 'Collections retrieved',"data": Colle_out});
      });
  });

  app.get('/collection', function(req, res, next) {
      //console.log(req.query.where);
    mongoose.connection.db.collection(req.query.where,function (err, collection) {
      if(err){res.status(500).json({message: req.query.where+' not retrieved',"data":[]}); return next(err);}
      collection.find().toArray(function(err, docs){
          //console.log(docs);
        return res.status(200).json({message: req.query.where+' retrieved',"data": docs});
      });
    });
  });

  app.get('/newPost', function (req, res) {

    var item_instance = new item({
      title: null,
      user: null,
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

      //item.find({ _id: mongoose.Types.ObjectId(req.body.id)}, function(err, instances){
      item.findOne({ _id: req.body.id}, function(err, instances){
        instances.title = req.body.title;
        instances.user = req.user.name;
        instances.description = req.body.description;
        instances.price = req.body.price;
        instances.trade = req.body.trade;
        instances.negotiable = req.body.negotiable;
        instances.email = req.body.email;
        instances.phone = req.body.phone;
        instances.methods = {facebook: req.body.methods.facebook,
          call: req.body.methods.call,
          txtmsg: req.body.methods.txtmsg,
          email: req.body.methods.email};
        instances.id = req.body.id;

          instances.postedBy = req.user._id;

        instances.save();
      });

    });
    res.send("success!");
  });
  app.get('/img/:id', function(req,res){
    //image.find({ _id: mongoose.Types.ObjectId(req.params.id)}, function(err, instance){
    image.findOne({ _id: req.params.id}, function(err, instance){
      if(instance)
        res.send(instance.data);
    });
  });
  app.get('/post/:id', function(req,res){
    //item.find({ _id: mongoose.Types.ObjectId(req.params.id)}, function(err, instance){
    item.findOne({ _id: req.params.id}, function(err, instance){
      res.send(instance);
    })
  });

  app.delete('/users', function(req,res){
    //item.find({ _id: mongoose.Types.ObjectId(req.params.id)}, function(err, instance){
    User.remove({},function(err){
        if(err) {
            return res.status(500).json({message: 'error',"data":[]});
        }
        return res.status(200).json({message: 'Users Cleared',"data":[]});
    });
  });

  app.delete('/items', function(req,res){
    //item.find({ _id: mongoose.Types.ObjectId(req.params.id)}, function(err, instance){
    item.remove({},function(err){
        if(err) {
            return res.status(500).json({message: 'error',"data":[]});
        }
        return res.status(200).json({message: 'Items Cleared',"data":[]});
    });
  });
  app.delete('/users/:id',function(req,res,next){
      User.findOneAndRemove({_id:req.params.id},req.body,function(err,del){
        if(err) {
            if (err.path == '_id') {
                var msg = '{"message": "User Not Found","data":[]}';
                msg = JSON.parse(msg);
                res.statusCode = 404;
                res.json(msg);
                return;
            }
            var msg = '{"message": "Server Error",'+'"data":'+JSON.stringify(del)+'}';
            msg = JSON.parse(msg);
            res.statusCode = 500 ;
            res.json(msg);
            return next(err);
        }
        if(JSON.stringify(del) == 'null') {
            var msg = '{"message": "User Not Found","data":[]}';
            msg = JSON.parse(msg);
            res.statusCode = 404;
            res.json(msg);
            return;
        }
        var msg = '{"message": "User Removed",'+'"data":'+JSON.stringify(del)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 200;
        res.json(msg);
        return;
      });
  });
  app.delete('/items/:id',function(req,res,next){
      item.findOneAndRemove({_id:req.params.id},req.body,function(err,del){
        if(err) {
            if (err.path == '_id') {
                var msg = '{"message": "Item Not Found","data":[]}';
                msg = JSON.parse(msg);
                res.statusCode = 404;
                res.json(msg);
                return;
            }
            var msg = '{"message": "Server Error",'+'"data":'+JSON.stringify(del)+'}';
            msg = JSON.parse(msg);
            res.statusCode = 500 ;
            res.json(msg);
            return next(err);
        }
        if(JSON.stringify(del) == 'null') {
            var msg = '{"message": "Item Not Found","data":[]}';
            msg = JSON.parse(msg);
            res.statusCode = 404;
            res.json(msg);
            return;
        }
        var msg = '{"message": "Item Removed",'+'"data":'+JSON.stringify(del)+'}';
        msg = JSON.parse(msg);
        res.statusCode = 200;
        res.json(msg);
        return;
      });
  });


  //Add user function
  app.post('/users',function(req,res,next){
      //check if the password is present
      if(req.body.password){
          var bcrypt = require('bcrypt');
          var hash = bcrypt.hashSync(req.body.password, 10);
          console.log("hash: "+hash);
          req.body.password = hash;
      }

      //check if the email field is present
      if(!req.body.email){
        res.status(500).json({message: 'Email field is required',"data":[]});
        return;
      }

      //Check if email format is valid
      var emailFormat = /^[a-z0-9]+$/;
      if (req.body.email.search(emailFormat) == -1) {
          console.log("invalid email");
          res.status(500).json({message: 'Email address is not valid',"data":[]});
          return;
      }

      //Create user
      User.create(req.body,function(err,post){
        //see if there are any errors
        if(err) {
          console.log("------XXXX-------");
          console.log(err);
          console.log("------XXXX-------");
          if(err.name == 'ValidationError') {
            var str = '';
            for (field in err.errors) {str = str+'['+err.errors[field].path+']'+' ';}
            res.status(500).json({message: 'sorry, '+str+'required',"data":[]});
            return;
          }
          if(err.code == 11000) {
            res.status(500).json({message: 'Email already used.', "data":[]});
            return;
          }
          var submsg;
          if(post) submsg = JSON.stringify(post);
          else submsg = '[]'
          var msg = '{"message": "Server Error","data":'+submsg+'}';
          msg = JSON.parse(msg);
          res.statusCode = 500;
          res.json(msg);
          return next(err);
        }

        //return success message
        res.status(201).json({message: 'User Added',"data":JSON.stringify(post)});
        console.log("============");
        console.log(req.user);
        console.log("============");
        return;
      });
  });

  app.put('/users/:id',function(req,res,next){
    if (!req.body){
        return res.status(500).json({message: 'no valid changes associated',"data":[]});
    }
    User.findOneAndUpdate({_id:req.params.id},req.body,function(err,put){
        if(err){
            console.log(err);
            if (err.path == '_id') { return res.status(404).json({message: 'User Not Found', "data":[]});}
            if(err.name == 'ValidationError') {
                var str = '';
                for (field in err.errors) {str = str+'['+err.errors[field].path+']'+' ';}
                return res.status(500).json({message: 'sorry, '+str+'required',"data":[]});
            }
            if(err.code == 11000) { return res.status(500).json({message: 'Email already used.', "data":[]});}
            return res.status(500).json({message: 'put err:'+err, "data":[]});}
        return res.status(200).json({message: 'User Updated', "data":put});
    });
  });
  app.put('/items/:id',function(req,res,next){
    if (!req.body){
        return res.status(500).json({message: 'no valid changes associated',"data":[]});
    }
    item.findOneAndUpdate({_id:req.params.id},req.body,function(err,put){
        if(err){
            console.log(err);
            if (err.path == '_id') { return res.status(404).json({message: 'Item Not Found', "data":[]});}
            if(err.name == 'ValidationError') {
                var str = '';
                for (field in err.errors) {str = str+'['+err.errors[field].path+']'+' ';}
                return res.status(500).json({message: 'sorry, '+str+'required',"data":[]});
            }
            return res.status(500).json({message: 'put err:'+err, "data":[]});}
        return res.status(200).json({message: 'Item Updated', "data":put});
    });
  });


};
