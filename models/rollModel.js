const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rollSchema = mongoose.Schema({
  name: 
  {
    type: String,
    required: true
  },
  status: 
  {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  createdAt: 
  {
    type: Date,
    default: Date.now
  },
  deletedAt: 
  {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Roll', rollSchema);
