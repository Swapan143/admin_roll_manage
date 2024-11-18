const express = require('express')
const router = express.Router();
const {
    login,
    register,
    forgotPassword,
    resetPassword,
    profile,
    userAdd,
    loginVerify,
    logout,
    forgotPasswordCheck,
    newPassword
} = require('../controller/AuthController');

const {dashboard} = require('../controller/admin/DashboardController');

const {protectedRoute,guestdRoute} = require('../middelware/authMiddelware');

router.get('/admin/dashboard',protectedRoute, (req,res)=>{
    //console.log("+++");
    dashboard(req, res);
});

router.get('/admin/login',guestdRoute, (req,res)=>{
    login(req, res);
});

router.get('/register', guestdRoute,(req,res)=>{
    register(req, res);
})

router.get('/admin/forgot-password',guestdRoute, (req,res)=>{
    
    forgotPassword(req, res);
})

router.get('/admin/reset-password/:token',guestdRoute, (req,res)=>{
    resetPassword(req, res);
})

router.get('/profile',protectedRoute, (req,res)=>{
    profile(req, res);
})

router.post('/register', (req,res)=>{
    userAdd(req, res);
})

router.post('/admin/login', (req,res)=>{
    loginVerify(req, res);
})

router.get('/admin/logout', (req,res)=>{
    logout(req, res);
})

router.post('/admin/forgot-password', (req,res)=>{
    forgotPasswordCheck(req, res);
})

router.post('/admin/reset-password',guestdRoute, (req,res)=>{
    newPassword(req, res);
})


module.exports = router