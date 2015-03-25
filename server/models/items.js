module.export(mongoose){
  var itemSchema = new mongoose.Schema({
    Name: String,
    img_link: String,
    views: Number,
  });
  mongoose.model('Item', itemSchema);
}
