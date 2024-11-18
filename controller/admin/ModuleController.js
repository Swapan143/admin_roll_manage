const asyncHandler = require("express-async-handler");
const modulesModel = require('../../models/modulesModel');

const userList = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('admin/layouts/master/master',{page_title:"Admin || Module List", active_menu:"ModuleController",page_name:'module/index'});
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/module/list'); 
        return; 
    }
})

const getDataAjax = asyncHandler(async(req, res) => 
{
    try
    {
        const { searchFdate, searchTdate, draw, start, length } = req.query;

        // Set up a query object to filter users based on date range
        let query = { parent_id: null};

        if (searchFdate && searchTdate) {
            query.createdAt = {
                $gte: new Date(searchFdate),
                $lte: new Date(searchTdate)
            };
        }

        // Get total records count before filtering
        const totalRecords = await modulesModel.countDocuments({});

        // Get filtered users based on date range
        const filteredModule = await modulesModel.find(query)
            .skip(Number(start))
            .limit(Number(length))
            .sort({ createdAt: -1 });
        //console.log(filteredUsers);

        // Get the count of filtered records
        const filteredRecords = await modulesModel.countDocuments(query);

        // Prepare data for DataTables
        const data = filteredModule.map((module, index) => {
            let status_check = '';
            if (module.status === "Active") {
                status_check = 'checked';
            }
        
            return {
                sl: Number(start) + index + 1,
                module_name: module.module_name,
                module_url: module.module_url,
                module_icon: module.module_icon,
                controller_name: module.controller_name,
                status: `<label class="switch">
                            <input type="checkbox" value="${module._id}" onchange="status_change(this.value)" ${status_check}>
                            <span class="slider round"></span>
                         </label>`,
                order_id: module.order_id,
                action: `<a href="/admin/module/edit/${module._id}" class="btn btn-primary">Edit</a><a href="/admin/submodule/list/${module._id}" class="btn btn-primary" style="margin-left: 5px;"><i class="fa fa-eye"></i></a>`
            };
        });

        //console.log(data)
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
        res.redirect('/admin/module/list'); 
        return; 
    }
})

const userAdd = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('admin/layouts/master/master',{page_title:"Admin || Module Add", active_menu:"ModuleController",page_name:'module/add'});
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
      
        const { module_name,module_url,module_icon,controller_name } = req.body;
        
        // Check if this user already exisits
        let module = await modulesModel.findOne({ module_url: module_url });
        if (module) 
        {
            req.flash('error','That module url already exisits!');
            res.redirect('/admin/module/add'); 
            return; 
        } 
        else 
        {
            let maxOrderId = await modulesModel.findOne({}).sort({ order_id: -1 }) .limit(1);
            let maxOrderInValue = maxOrderId ? maxOrderId.order_id+1 : 1;


            // Create a new user instance
            const newModule = new modulesModel({
                module_name,
                module_url,
                module_icon, 
                controller_name,
                order_id:maxOrderInValue
            });

            // Save the user to the database
            await newModule.save();

            req.flash('success','Module added successfully!');
            res.redirect('/admin/module/list'); 
            return;
          
           
        }
    } 
    catch (error) 
    {
        req.flash('error','Error adding user!');
        res.redirect('/admin/module/add'); 
        return; 
    }
});

const userEdit = asyncHandler(async(req, res) => 
{
    try
    {
        let userId = req.params.id;
        
        let module = await modulesModel.findById(userId);
        
        if(!module)
        {
            req.flash('errot','User not found!');
            res.redirect('/admin/module/list'); 
            return; 
        }
       
        req.flash('success','Retiveed successfully!');
        res.render('admin/layouts/master/master',{page_title:"Admin | Module Edit", active_menu:"ModuleController",page_name:'module/edit',module});
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
        const { module_name,module_url,module_icon,controller_name } = req.body;
        
        const updateData = {
            module_name: module_name,
            module_url: module_url,
            module_icon: module_icon,
            controller_name:controller_name, 
        };
        
        const updatedDocument = await modulesModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true } 
        );

        if (!updatedDocument) 
            {
            req.session.message = {
                type: "danger",
                message: "Something went wrong!"
            };
            req.flash('error','Something went wrong!');
            res.redirect('/admin/module/list');
            return; 
        }
        else 
        {
            
            req.flash('success','Module updated successfully!');
            res.redirect('/admin/module/list');
            return; 
        }
        
    } catch (err) {
        req.flash('error','Error adding user!');
        res.redirect('/admin/module/add'); 
        return; 
    }
});


const statusChange = asyncHandler(async(req, res) => 
{
    try 
    {
        const { id } = req.body;

        // Find the role by ID
        const modulesData = await modulesModel.findOne({ _id: id });

        if (modulesData) 
        {
            // Toggle the status
            modulesData.status = modulesData.status === 'Active' ? 'Inactive' : 'Active';

            // Save the updated role
            await modulesData.save();
            res.status(200).json({ success: true });
        } 
        else 
        {
            res.status(404).json({ success: false, message: 'Role not found' });
        }
    } 
    catch (error) 
    {
        req.flash('error','Error adding user!');
        res.redirect('/admin/module/list'); 
        return; 
    }
});


module.exports = {userList,getDataAjax,userAdd,userStore,userEdit,userUpdate,statusChange}