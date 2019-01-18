var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//  create new NoteSchema object
var NoteSchema = new Schema({
  title: String,
  body: String
});

// create model from the above schema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
