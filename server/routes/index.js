var express = require('express')
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();

//var ObjectID = require('mongodb').ObjectID;
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
  var User = mongoose.model('User');
    
    //-authentication-authentication-authentication-authentication-authentication-authentication-authentication-

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
      console.log("-----");
    User.findOne({ email: username }, function (err, user) {
      if (err) { console.log("err"); return done(err); }
      if (!user) { console.log("No user with this email");
        return done(null, false, { message: 'Incorrect email.' });
      }
      //if (!user.validPassword(password)) { console.log("wrong password");
      //if (user.password != password) { console.log("wrong password");
      var bcrypt = require('bcrypt');
      if (!bcrypt.compareSync(password, user.password)) { console.log("Wrong password");
        return done(null, false, { message: 'Incorrect password.' });
      }
        console.log("good");
        //$window.sessionStorage.user = user;
        console.log(user);
        console.log(done);
      return done(null, user);
    });
  }
));
    
    passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
    
/*app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: true
                                 })
);*/
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { console.log('info: '+info); return res.status(200).json(info); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.status(200).json({message: 'Logged in',"data": user.name});
    });
  })(req, res, next);
});
/*app.get('/login', function(req, res) {
    console.log(flash('error'));
    res.send();
});*/
    /*app.post('/login', function(req, res, next) {
        console.log("---xxx--");
        console.log(req.body);
        console.log("---xxx--");
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { console.log("no user"); return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { console.log("login problem"); return next(err); }
        console.log("can login");
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});*/




/*    var passport = require('passport');
    passport.use(User.localStrategy);
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);
    
    app.use(passport.initialize());
app.use(passport.session());
    var auth = require('../public/javascripts/authCon.js');

app.post('/auth/login', auth.login);
app.post('/auth/logout', auth.logout);
app.get('/auth/login/success', auth.loginSuccess);
app.get('/auth/login/failure', auth.loginFailure);
app.post('/auth/register', auth.register);*/


//-authentication-authentication-authentication-authentication-authentication-authentication-authentication-


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
    
  app.get('/users', function(req, res, next) {
    User.find(function(err, users){
      if(err){ return next(err); }
      Users_out = [];
        console
      for(var i=0; i<users.length && i<25; i++){

        if(users[i].email != null){
          Users_out.push(users[i]);
        }
      }
      res.json(Users_out);
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

      //item.find({ _id: mongoose.Types.ObjectId(req.body.id)}, function(err, instances){
      item.findOne({ _id: req.body.id}, function(err, instances){
        instances.title = req.body.title;
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
        instances.save();
      });

    });
    res.send("success!");
  });
  app.get('/img/:id', function(req,res){
    //image.find({ _id: mongoose.Types.ObjectId(req.params.id)}, function(err, instance){
    image.findOne({ _id: req.params.id}, function(err, instance){
      
      res.send(instance.data);
    });
  });
  app.get('/post/:id', function(req,res){
    //item.find({ _id: mongoose.Types.ObjectId(req.params.id)}, function(err, instance){
    item.findOne({ _id: req.params.id}, function(err, instance){
      res.send(instance);
    })
  });
    
  app.post('/users',function(req,res,next){
      //console.log(req);
      if(req.body.password){
          var bcrypt = require('bcrypt');
          var hash = bcrypt.hashSync(req.body.password, 10);
          console.log("hash: "+hash);
          req.body.password = hash;
      }
      if(!req.body.email){
            res.status(500).json({message: 'Email field is required',"data":[]});
            return;
        }
        else{
            var emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (req.body.email.search(emailFormat) == -1) {
                res.status(500).json({message: 'Email address is not valid',"data":[]});
                return;
            }
        }
      User.create(req.body,function(err,post){
          //console.log("------------------------------------------------------------");
          //console.log(req.body);
          //console.log("------------------------------------------------------------");
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
        if(!post.name){
            res.status(500).json({message: 'Name field is required',"data":[]});
            return;
        }
        if(!post.email){
            res.status(500).json({message: 'Email field is required',"data":[]});
            return;
        }
        else{
            var emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (post.email.search(emailFormat) == -1) {
                res.status(500).json({message: 'Email address is not valid',"data":[]});
                return;
            }
        }
        if(!post.password){
            res.status(500).json({message: 'Password field is required',"data":[]});
            return;
        }
        //var msg = '{"message": "User Added","data":'+JSON.stringify(post)+'}';
        //msg = JSON.parse(msg);
        //res.statusCode = 201;
        //res.json(msg);
          res.status(201).json({message: 'User Added',"data":JSON.stringify(post)});
          //console.log("============");
          //console.log(req.user);
          //console.log("============");
        return;
      });
  });
    
};

