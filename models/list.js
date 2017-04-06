var mongoose = require('mongoose');

var listSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    listid: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    items: [String]
});


var List = mongoose.model("List", listSchema);

module.exports = List;