const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const fs = require('fs');
// const { validationResult } = require('express-validator');
const rollModel = require('../../models/rollModel');
const permissionsModel = require('../../models/permissionsModel');
const modulesModel = require('../../models/modulesModel');

const userList = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('admin/layouts/master/master',{page_title:"Admin | Roll List", active_menu:"roll_manage",page_name:'roll/index'});
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/roll/list'); 
        return; 
    }
})

const getDataAjax = asyncHandler(async(req, res) => 
{
    try
    {
        const { searchFdate, searchTdate, draw, start, length } = req.query;

        // Set up a query object to filter users based on date range
        let query = {};

        if (searchFdate && searchTdate) {
            query.createdAt = {
                $gte: new Date(searchFdate),
                $lte: new Date(searchTdate)
            };
        }

        // Get total records count before filtering
        const totalRecords = await rollModel.countDocuments({});

        // Get filtered users based on date range
        const filteredUsers = await rollModel.find(query)
            .skip(Number(start))
            .limit(Number(length))
            .sort({ createdAt: -1 });

        // Get the count of filtered records
        const filteredRecords = await rollModel.countDocuments(query);

        // Prepare data for DataTables
        const data = filteredUsers.map((user, index) => ({
            sl: Number(start) + index + 1,
            name: user.name,
            created_at: user.createdAt.toISOString().split('T')[0],
            action: `<a href="/admin/roll/edit/${user._id}" class="btn btn-primary">Edit</a><a href="/admin/roll/permission/${user._id}" style="font-size: 15px; margin-left: 10px;" class="btn btn-primary waves-effect details-control">SET PERMISSION</a>`
        }));

        // Send response in the format DataTables expects
        res.json({
            draw: draw,
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data: data
        });
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/roll/list'); 
        return; 
    }
})

const userAdd = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('admin/layouts/master/master',{page_title:"Admin | Roll List", active_menu:"roll_manage",page_name:'roll/add'});
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/roll/list'); 
        return; 
    }
})

const userStore = asyncHandler(async(req, res) => 
{
    try 
    {
        console.log(req.body);
        const { name} = req.body;
        
        
        // Check if this user already exisits
        let user = await rollModel.findOne({ name: name });
        if (user) 
        {
            req.flash('error','That roll already exisits!');
            res.redirect('/admin/roll/add'); 
            return; 
        } 
        else 
        {
            // Create a new user instance
            const newUser = new rollModel({
                name,
            });

            // Save the user to the database
            await newUser.save();

            req.flash('success','Roll added successfully!');
            res.redirect('/admin/roll/list'); 
            return;
          
           
        }
    } 
    catch (error) 
    {
        req.flash('error','Error roll user!');
        res.redirect('/admin/roll/add'); 
        return; 
    }
});

const userEdit = asyncHandler(async(req, res) => 
{
    try
    {
        let userId = req.params.id;
        
        let user = await rollModel.findById(userId);
        if(!user)
        {
            req.flash('errot','Roll not found!');
            res.redirect('/admin/user/list'); 
            return; 
        }
       
        req.flash('success','Retiveed successfully!');
        res.render('admin/layouts/master/master',{page_title:"Admin | Roll Edit", active_menu:"roll_manage",page_name:'roll/edit',user:user});
        return; 

    }
    catch(err)
    {
        req.flash('error','Error adding roll!');
        res.redirect('/admin/roll/add'); 
        return; 
        
    }
})

const userUpdate = asyncHandler(async (req, res) => 
{
    try 
    {
        let userId = req.params.id;
       
        const updateData = {
            name: req.body.name,
        };
        
        const updatedDocument = await rollModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedDocument) 
            {
            req.session.message = {
                type: "danger",
                message: "Something went wrong!"
            };
            req.flash('error','Something went wrong!');
            res.redirect('/admin/roll/list');
            return; 
        }
        else 
        {
            
            req.flash('success','Roll updated successfully!');
            res.redirect('/admin/roll/list');
            return; 
        }
        
    } catch (err) {
        req.flash('error','Error adding user!');
        res.redirect('/admin/roll/add'); 
        return; 
    }
});


const rolePermission = asyncHandler(async(req, res) => 
{
    try
    {
        const roleId = req.params.id;  // Assuming role id is passed as a parameter
        let moduleArray = [];
    
        try 
        {
            // Fetch the role data
            const role = await rollModel.findById(roleId);

    
            // Fetch permissions for the given role where permission = 1
            const permissions = await permissionsModel.find({
                role_id: roleId,
                permission: '1'  // Assuming '1' means permission granted
            });
            
            
            // Extract module_ids from permissions
            let permissionArray = [];
            if (permissions.length > 0) 
            {
                permissionArray = permissions.map(p => p.module_id);
            }
           
            
            // Fetch top-level modules (parent_id = 0) where status is 'Active'
            const modules = await modulesModel.find({
                parent_id: null,  
                status: 'Active'
            });
    
            // Iterate through each module and find its sub-modules
            for (let module of modules) 
            {
                // Fetch sub-modules where parent_id is the current module's _id and status is 'Active'
                const subModules = await modulesModel.find({
                    parent_id: module._id,
                    status: 'Active'
                });
    
                if (subModules.length > 0) 
                {
                    moduleArray.push({ module, sub_modules: subModules });
                } 
                else 
                {
                    moduleArray.push({ module, sub_modules: [] });
                }
            }
            console.log("permissionArray"+permissionArray);
            res.render('admin/layouts/master/master',{page_title:"Admin | Roll List", active_menu:"roll_manage",page_name:'roll/permission_module',modules: moduleArray,
                roles: role,
                permission_array: permissionArray});
    
        } 
        catch (err) 
        {
            console.error(err);
            res.status(500).send('Server Error');
        }
        
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/roll/list'); 
        return; 
    }
});

const updateRolePermission = asyncHandler(async(req, res) => 
{
    try
    {
        const input = req.body;
        const moduleIds = req.body['module_id[]']; 
       
        if (moduleIds && moduleIds.length > 0) 
        {
            
            // Fetch existing action permissions for the role
            const actionPermRole = await permissionsModel.find({ role_id: input.roleId });

            let perValArray = actionPermRole.map(value => value.module_id);

            // Find the difference between existing permissions and the provided module_ids
            let result = perValArray.filter(value => !moduleIds.includes(value));

            // Update permissions to 0 for modules not included in the input
            for (let value1 of result) 
            {
                await permissionsModel.updateOne(
                    { role_id: input.roleId, module_id: value1 },
                    { $set: { permission: 0 } }
                );
            }

            // Iterate through each module_id from the input
            for (let moduleVal of moduleIds) 
            {
                // Check if the permission exists for this role and module
                const actionPermExist = await permissionsModel.find({
                    role_id: input.roleId,
                    module_id: moduleVal
                });

                if (actionPermExist.length > 0) 
                {
                    // Update permission to 1 if it exists
                    await permissionsModel.updateOne(
                        { role_id: input.roleId, module_id: moduleVal },
                        { $set: { permission: 1 } }
                    );
                } 
                else 
                {
                    // Insert a new permission if it does not exist
                    const newPermission = new permissionsModel({
                        module_id: moduleVal,
                        role_id: input.roleId,
                        status: 'Active',
                        permission: 1
                    });
                   
                    await newPermission.save();
                }
            }
            req.flash('success','Permissions updated successfully swa!');
            res.redirect('/admin/roll/list'); 
            return;
        } 
        else 
        {
            // If no module_id is provided, delete all permissions for the role
            await permissionsModel.deleteMany({ role_id: input.roleId });
            req.flash('success','Permissions updated successfully!');
            res.redirect('/admin/roll/list'); 
            return;
           
        }
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/roll/list'); 
        return; 
    }
});


module.exports = {userList,getDataAjax,userAdd,userStore,userEdit,userUpdate,rolePermission,updateRolePermission}