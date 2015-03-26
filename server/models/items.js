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

  var imageSchema = new mongoose.Schema({
    data:Buffer
  });
  mongoose.model('Image, imageSchema');
};
