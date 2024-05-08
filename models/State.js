const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
  stateCode: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z]{2}$/,
  },
  funfacts: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model('State', stateSchema);
