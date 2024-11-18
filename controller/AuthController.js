const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');


const login = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('admin/auth/admin_login',{page_title:"Login Page",active_menu:"login"})
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/login'); 
        return;
    }
})

const register = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('auth/register',{ page_title:"Register Page",active_menu:"register"})
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/'); 
        return;
    }
})

const forgotPassword = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('admin/auth/admin_forgot',{ page_title:"forgot Password Page",active_menu:"forgot"})
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/login'); 
        return;
    }
})


const resetPassword = asyncHandler(async(req, res) => 
{
    try
    {
        const { token } = req.params;
        // Check if this user already exisits
        let user = await userModel.findOne({ token: token });
        if (user) 
        {
            res.render('admin/auth/admin_reset',{ page_title:"Reset Password Page",active_menu:"reset",token})
        } 
        else 
        {
            req.flash('error','Link ecpired or Invalid');     
            res.redirect('/admin/forgot-password');
            return;
        }
        
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/login'); 
        return;
    }
})

const profile = asyncHandler(async(req, res) => 
{
    try
    {
        res.render('profile/profile',{ page_title:"Profile Page",active_menu:"profile"})
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/'); 
        return;
    }
})

const userAdd = asyncHandler(async(req, res) => 
{
    try 
    {
        const { name, email, password } = req.body;
        // If you have an image file
        const hashPassword = await bcrypt.hash(password,10); 

        // Check if this user already exisits
        let user = await userModel.findOne({ email: email });
        if (user) 
        {
            req.flash('error','That email already exisits!');
            res.redirect('/register');
            return;
        } 
        else 
        {
            // Create a new user instance
            const newUser = new userModel({
                name,
                email,
                password:hashPassword,    
            });

            // Save the user to the database
            await newUser.save();

            // Send a response back to the client
            req.flash('success','User registered successfully! you can login now');
            res.redirect('/login');
            return;
           
           
        }
    } 
    catch (error) 
    {
        req.flash('error','Something went wrong!');
        res.redirect('/register')
    }
});

const loginVerify = asyncHandler(async(req, res) => 
{
    try 
    {
        const { email, password } = req.body;
        // Check if this user already exisits
        let user = await userModel.findOne({ email: email });
        if (user && (await bcrypt.compare(password,user.password))) 
        {
            req.session.user=user;
            req.flash('success','Login successfully!');
            res.redirect('/admin/dashboard');
            return;
        } 
        else 
        {
            req.flash('error','Invalid Email or password');
            res.redirect('/admin/login');
            return;
        }
    } 
    catch (error) 
    {
        req.flash('error','Something went wrong!');
        res.redirect('/admin/login');
        return;
    }
});

const logout = asyncHandler(async(req, res) => 
{
    req.flash('success','Logout successfully');
    req.session.destroy();
    res.redirect('/admin/login'); 
    return;
})


const forgotPasswordCheck = asyncHandler(async(req, res) => 
{
    try 
    {
        const { email } = req.body;
        // Check if this user already exisits
        let user = await userModel.findOne({ email: email });
        if (!user) 
        {
            req.flash('error','User not found with this email!');
            res.redirect('/admin/forgot-password');
            return;
        } 

        const token= Math.random().toString(36).slice(2);
        console.log(token);
        user.token=token;
        await user.save();

        // Create a transporter object
        let transporter = nodemailer.createTransport({
            service: 'gmail', // You can use 'gmail' or other SMTP services
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass:  process.env.EMAIL_PASS   // Your email password (consider using an app password or environment variables)
            }
        });

        // Define email options
        let mailOptions = {
            from: 'swapan.kanrar143@gmail.com',  
            to: email,
            subject: 'Password Reset',
            text: 'Reset Your Password',
            html:`<p>Click this link to reset your password <a href="http://localhost:3000/admin/reset-password/${token}">Reset Password</a><br> Thank You</p>`
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        if(info.messageId)
        {
            console.log('Email sent: ' + info.response);
            req.flash('success','Password reset link to sent your email!');
            res.redirect('/admin/forgot-password');
            return;
        } 
        else
        {
            req.flash('error','User not found with this email!');
            res.redirect('/admin/forgot-password');
            return;
        }
        
    } 
    catch (error) 
    {
        req.flash('error','Something went wrong!');
        res.redirect('/admin/forgot-password');
        return;
    }
});

const newPassword = asyncHandler(async(req, res) => 
{
    try
    {
        const { token,new_password,confirm_password } = req.body;
        // Check if this user already exisits
        if(new_password !== confirm_password)
        {
            req.flash('error','Password do not match');
            res.redirect(`,admin/reset-password/${token}`);
            return;
        }

        let user = await userModel.findOne({ token: token });
        if (!user) 
        {
            req.flash('error','Invalid token');
            res.redirect('/admin/forgot-password');
            return;
        } 
        
        user.password= await bcrypt.hash(new_password,10); ;
        user.token= null;
        user.save();

        req.flash('success','Password reset successfully');
        res.redirect('/admin/login');
        return;
    }
    catch(err)
    {
        req.flash('error','Something went wrong');
        res.redirect('/admin/login'); 
        return;
    }
});


module.exports = {login,register,forgotPassword,resetPassword,profile,userAdd,loginVerify,logout,forgotPasswordCheck,newPassword}