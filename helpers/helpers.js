// helpers/helpers.js
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose')
const permissionsModel = require('../models/permissionsModel');
const modulesModel = require('../models/modulesModel');

module.exports = {
    // A simple helper function to format dates
    formatDate: function (date) {
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    },
  
    // A helper to capitalize the first letter of a string
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  
    // A helper to check user roles (example for a role-based sidebar)
    isAdmin: function (user) {
      return user && user.role === 'admin';
    },

    getUserMenu: async function(user){
        let menuArray = [];
        const modules = await modulesModel.find({ parent_id: null, status: 'Active' }).sort({ order_id: 1 });
        
        const role_id=user.role_id;
        if (modules.length > 0) 
        {
            for (let i = 0; i < modules.length; i++) 
            {
                const module = modules[i];
                // Check if the user has access to the module
                if (await this.isUserHasAccess(module._id,role_id)) 
                {
                    

                    // Create main menu array
                    const menuItem = {
                        id: module._id,
                        name: module.module_name,
                        controller_name: module.controller_name,
                        url: module.module_url,
                        icon: module.module_icon,
                        sub_menus: []
                    };

                    const subModules = await modulesModel.find({ parent_id: module._id, status: 'Active' }).sort({ order_id: 1 });;
                    // Check for submenus
                    if (subModules.length > 0) 
                    {
                        for (let j = 0; j < subModules.length; j++) 
                        {
                            const subMenu = subModules[j];
                            // Create submenu array
                            const subMenuItem = {
                                id: subMenu._id,
                                name: subMenu.module_name,
                                controller_name: subMenu.controller_name,
                                url: subMenu.module_url,
                                icon: subMenu.module_icon,
                                nes_sub_menus: []
                            };

                            menuItem.sub_menus.push(subMenuItem);
                        }
                    }

                    menuArray.push(menuItem);
                }
            }
        }
        //console.log(menuArray);
        return menuArray;
    },    
    isUserHasAccess: async function(module_id,role_id)
    {

        const permissionRecord = await permissionsModel.findOne({
            role_id: new mongoose.Types.ObjectId(role_id),
            module_id: new mongoose.Types.ObjectId(module_id)
        });

        // Check if permission exists and is '1'
        if (permissionRecord && permissionRecord.permission === '1') 
        {
            return true;
        } 
        else 
        {
            return false;
        }
    }
};
  