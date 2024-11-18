const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modulesSchema = mongoose.Schema({
  parent_id: 
  {
    type: mongoose.Schema.Types.ObjectId,  // ObjectId to reference another document's _id
    ref: 'Modules',  // Refers to the same model (self-reference)
    default: null    // Allowing it to be null for top-level (parent) modules
  },
  module_name: 
  {
    type: String,
    required: true
  },
  module_url: 
  {
    type: String,
    required: false
  },
  module_icon: 
  {
    type: String,
    required: true
  },
  order_id: 
  {
    type: Number,
    required: true
  },
  controller_name: 
  {
    type: String,
    required: false
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

module.exports = mongoose.model('Modules', modulesSchema);
