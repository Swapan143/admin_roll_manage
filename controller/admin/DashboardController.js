const asyncHandler = require("express-async-handler");
const userModel = require('../../models/userModel');
const helpers = require('../../helpers/helpers');


const dashboard = asyncHandler(async(req, res) => 
{
    try
    {
        
        const totalUsers = await userModel.countDocuments();
        res.render('admin/layouts/master/master',{page_title:"Admin | Dashboard",active_menu:"DashboardController",page_name:'dashboard/dashboard',totalUsers})
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/login'); 
    }
});


module.exports = {dashboard}