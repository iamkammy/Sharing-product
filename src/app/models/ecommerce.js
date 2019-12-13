const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AppSchema = new Schema({
    name: {
        type: String,
        requitred: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    packageName: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});

module.exports = new mongoose.model('Apps', AppSchema);