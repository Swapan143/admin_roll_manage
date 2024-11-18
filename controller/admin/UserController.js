const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const fs = require('fs');
// const { validationResult } = require('express-validator');
const userModel = require('../../models/userModel');
const rollModel = require('../../models/rollModel');

const userList = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('admin/layouts/master/master',{page_title:"Admin || User List", active_menu:"user_manage",page_name:'user/index'});
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/user/list'); 
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
        const totalRecords = await userModel.countDocuments({});

        // Get filtered users based on date range
        const filteredUsers = await userModel.find(query).populate('role_id')
            .skip(Number(start))
            .limit(Number(length))
            .sort({ createdAt: -1 });
        //console.log(filteredUsers);

        // Get the count of filtered records
        const filteredRecords = await userModel.countDocuments(query);

        // Prepare data for DataTables
        const data = filteredUsers.map((user, index) => ({
            sl: Number(start) + index + 1,
            name: user.name,
            role: user.role_id.name,
            email: user.email,
            created_at: user.createdAt.toISOString().split('T')[0],
            action: `<a href="/admin/user/edit/${user._id}" class="btn btn-primary">Edit</a>`
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
        res.redirect('/admin/user/list'); 
        return; 
    }
})

const userAdd = asyncHandler(async(req, res) => 
{
    try
    {
        const rolldata = await rollModel.find({ status: 'Active',
            deletedAt: null });
        //console.log(rolldata);
        res.render('admin/layouts/master/master',{page_title:"Admin || User List", active_menu:"user_manage",page_name:'user/add',rolldata});
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/user/list'); 
        return; 
    }
})

const userStore = asyncHandler(async(req, res) => 
{
    try 
    {
        console.log(req.body);
        const { name,email,phone,password,role_id } = req.body;
        
        // If you have an image file
        const hashPassword = await bcrypt.hash(password,10); 
        // If you have an image file
        const image = req.file ? req.file.filename : null; 

        // Check if this user already exisits
        let user = await userModel.findOne({ email: email });
        if (user) 
        {
            req.flash('error','That email already exisits!');
            res.redirect('/admin/user/add'); 
            return; 
        } 
        else 
        {
            // Create a new user instance
            const newUser = new userModel({
                name,
                email,
                phone, 
                password:hashPassword, 
                role_id,
                image    
            });

            // Save the user to the database
            await newUser.save();

            req.flash('success','User added successfully!');
            res.redirect('/admin/user/list'); 
            return;
          
           
        }
    } 
    catch (error) 
    {
        req.flash('error','Error adding user!');
        res.redirect('/admin/user/add'); 
        return; 
    }
});

const userEdit = asyncHandler(async(req, res) => 
{
    try
    {
        let userId = req.params.id;
        
        let user = await userModel.findById(userId);
        const rolldata = await rollModel.find({ status: 'Active',
            deletedAt: null });
        console.log(user);
        if(!user)
        {
            req.flash('errot','User not found!');
            res.redirect('/admin/user/list'); 
            return; 
        }
       
        req.flash('success','Retiveed successfully!');
        res.render('admin/layouts/master/master',{page_title:"Admin || User Edit", active_menu:"user_manage",page_name:'user/edit',user:user,rolldata});
        return; 

    }
    catch(err)
    {
        req.flash('error','Error adding user!');
        res.redirect('/admin/user/add'); 
        return; 
        
    }
})

const userUpdate = asyncHandler(async (req, res) => 
{
    try 
    {
        let userId = req.params.id;
        const image = req.file ? req.file.filename : req.body.old_image; 
        
        if (req.file) {
            fs.unlink('public/uploads/user/' + req.body.old_image, (err) => {
                if (err) {
                    console.error('File deletion failed:', err);
                }
            });
        }
        
        let hashPassword;

        if (req.body.password) 
        { 
            // Checks if password is not undefined, null, or an empty string
            hashPassword = await bcrypt.hash(req.body.password, 10); 
        } 
        else 
        {
            hashPassword = req.body.old_password;
        }

        const updateData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.mobile,
            password:hashPassword, 
            role_id: req.body.role_id,
            image: image
        };
        
        const updatedDocument = await userModel.findByIdAndUpdate(
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
            res.redirect('/admin/user/list');
            return; 
        }
        else 
        {
            
            req.flash('success','User updated successfully!');
            res.redirect('/admin/user/list');
            return; 
        }
        
    } catch (err) {
        req.flash('error','Error adding user!');
        res.redirect('/admin/user/add'); 
        return; 
    }
});

/*const userDelete = asyncHandler(async(req, res) => 
{
    try
    {
        let userId = req.params.id;

        userModel.findByIdAndDelete(userId)
        .then(result => {
            if (result)
            {
                try
                {
                    fs.unlink('public/uploads/' + result.image, (err) => {
                        if (err) {
                            console.error('File deletion failed:', err);
                        }
                    });
                    req.session.message = {
                        type: "success",
                        message: "User delated successfully!"
                    };
                    res.redirect('/');
                }
                catch(err)
                {
                    console.log(err);
                }
            }
        })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({error: "Iternal Server error!"})  
    }
})*/





module.exports = {userList,getDataAjax,userAdd,userStore,userEdit,userUpdate}