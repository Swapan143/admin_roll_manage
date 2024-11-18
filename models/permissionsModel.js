const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionsSchema = mongoose.Schema({
  module_id: 
  {
    type: mongoose.Schema.Types.ObjectId,  // ObjectId to reference the Modules model
    ref: 'Modules',  // References the Modules model
    required: true   // Ensure that a module is selected
  },
  role_id: 
  {
    type: mongoose.Schema.Types.ObjectId,  // ObjectId to reference the Roll/Role model
    ref: 'Roll',  // References the Roll model (assuming "Roll" should be "Role")
    required: true
  },
  permission: 
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

module.exports = mongoose.model('Permissions', permissionsSchema);
