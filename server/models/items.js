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
    username: {type:String,required: true,index: { unique: true }},
    lastname: String,
    firstname: String,
    status: Number,
    online: Boolean,
    email: {type:String,required: true,index: { unique: true }},
    password: { type: String, set: function(newValue) {return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);} },
    phone: Number,
    methods: {facebook: Boolean,
              call: Boolean,
              txtmsg: Boolean,
              email: Boolean },
    postedItems : [String],
    image: String,
    dateCreated : {type:Date,default:Date.now}
  });
  mongoose.model('User', userSchema);
  mongoose.model('User', userSchema).on('index', function (err) {
    if (err) console.error(err);
  });
    
};
