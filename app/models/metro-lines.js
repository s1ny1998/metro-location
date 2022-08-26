'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;
const options = {
  timestamps: true,
};

const getRequiredFiledMessage = (filed) => {
  const message = `${filed} Should Not Be Empty`;
  return [true, message];
};

const MetroLinesSchema = new Schema({
  name: {
    type: String,
    enum: ['Purple', 'Green', 'Blue', 'Pink', 'Yellow'],
    required: getRequiredFiledMessage('Name'),
    trim: true,
  },
  LineArray: {
    type: [String],
    required: getRequiredFiledMessage('LineArray'),
    trim: true,
  },
}, options);

module.exports = mongoose.model('Lines', MetroLinesSchema);
