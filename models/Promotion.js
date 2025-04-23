const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  day: { type: String, required: true },
  message: { type: String, required: true }
});

module.exports = mongoose.model('Promotion', promotionSchema);
