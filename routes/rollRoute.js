const express = require('express');
const router = express.Router();
const {
    userList,
    getDataAjax,
    userAdd,
    userStore,
    userEdit,
    userUpdate,
    rolePermission,
    updateRolePermission
} = require('../controller/admin/RollController');


const {protectedRoute,guestdRoute} = require('../middelware/authMiddelware');

router.get('/list',protectedRoute, (req,res)=>{
    //console.log("+++");
    userList(req, res);
});

router.get('/get-data-ajax',protectedRoute, (req,res)=>{
    //console.log("+++");
    getDataAjax(req, res);
});

router.get('/add', (req,res)=>{
    userAdd(req, res);
})

router.post('/store',(req, res) => {
    userStore(req, res);
});


router.get('/edit/:id', protectedRoute, (req,res)=>{
    userEdit(req, res);
});

router.post('/update/:id', (req,res)=>{
    userUpdate(req, res);
});

router.get('/permission/:id', protectedRoute, (req,res)=>{
    rolePermission(req, res);
});

router.post('/permission-update', (req,res)=>{
    updateRolePermission(req, res);
});



// Handle form submission and pass data to controller
/*router.post('/submit-user-form', upload.single('image'), (req, res) => {
    //userAdd(req, res);
});*/



module.exports = router