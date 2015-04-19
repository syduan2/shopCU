var passportLocalMongoose = require('passport-local-mongoose');
var PassportLocalStrategy = require('passport-local').Strategy;

module.exports=function(mongoose){
  var itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    tag: String,
    price: Number,
    negotiable: Boolean,
    trade: Boolean,
    email: String,
    phone: Number,
    methods: {facebook: Boolean,
              call: Boolean,
              txtmsg: Boolean,
              email: Boolean },
    images: [String]
  });
  mongoose.model('Item', itemSchema);

  var imgSchema = new mongoose.Schema({
    data: Buffer
  });
  mongoose.model('Image', imgSchema);
    
  var userSchema = new mongoose.Schema({
    /*username: {type:String, index: { unique: true }},
    lastname: String,
    firstname: String,
    status: Number,
    online: Boolean,
    email: {type:String, index: { unique: true }},
    password: { type: String, set: function(newValue) {return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);} },
    phone: Number,
    methods: {facebook: Boolean,
              call: Boolean,
              txtmsg: Boolean,
              email: Boolean },
    postedItems : [String],
    image: String,
    dateCreated : {type:Date,default:Date.now}*/
      
    name: {type:String, required:true, trim:true},
    email: {type:String, required: true, trim: true, lowercase:true, unique: true},
    image: {type:String},
    password: {type:String, required: true },
    created: {type: Date, default: Date.now}
  });
  //userSchema.plugin(passportLocalMongoose);
    
/*    userSchema.statics.localStrategy = new PassportLocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },

    // @see https://github.com/jaredhanson/passport-local
    function (username, password, done){
        var User = require('./User');
        User.findOne({email: username}, function(err, user){
            if (err) { return done(err); }

            if (!user){
                return done(null, false, { message: 'User not found.'} );
            }
            if (!user.validPassword(password)){
                return done(null, false, { message: 'Incorrect password.'} );
            }

            // I'm specifying the fields that I want to save into the user's session
            // *I don't want to save the password in the session
            return done(null, {
                id: user._id,
                name: user.name,
                image: user.image,
                email: user.email,
            });
        });
    }
);

userSchema.methods.validPassword = function(password){
    if (this.password == password){
        return true;
    }

    return false;
}

userSchema.statics.serializeUser = function(user, done){
    done(null, user);
};

userSchema.statics.deserializeUser = function(obj, done){
    done(null, obj);
};*/

    
  mongoose.model('User', userSchema);
  mongoose.model('User', userSchema).on('index', function (err) {
    if (err) console.error(err);
  });
    
};
