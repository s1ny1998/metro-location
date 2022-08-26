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

const MetroLocationSchema = new Schema({
  name: {
    type: String,
    required: getRequiredFiledMessage('Name'),
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: getRequiredFiledMessage('line'),
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: getRequiredFiledMessage('line'),
    },
  },
  line: {
    type: String,
    enum: ['Purple', 'Green'],
    required: getRequiredFiledMessage('line'),
    trim: true,
  },
  changeDirection: {
    type: String,
    required: getRequiredFiledMessage('changeDirection'),
    trim: true,
  },
  changeLocation: {
    type: String,
    required: getRequiredFiledMessage('changeLocation'),
    trim: true,
  },
}, options);

module.exports = mongoose.model('Location', MetroLocationSchema);
