var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//  create a new UserSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
  //  object that stores a Note id
 
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});
// This creates a model from the above schema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
