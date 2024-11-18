const express = require('express');
const router = express.Router();
const {
    userList,
    getDataAjax,
    userAdd,
    userStore,
    userEdit,
    userUpdate,
    statusChange
} = require('../controller/admin/SubModuleController');


const {protectedRoute,guestdRoute} = require('../middelware/authMiddelware');

router.get('/list/:id',protectedRoute, (req,res)=>{
    //console.log("+++");
    userList(req, res);
});

router.get('/get-data-ajax',protectedRoute, (req,res)=>{
    //console.log("+++");
    getDataAjax(req, res);
});

router.get('/add/:id', (req,res)=>{
    userAdd(req, res);
})

router.post('/store', (req, res) => {
    userStore(req, res);
});


router.get('/edit/:id', protectedRoute, (req,res)=>{
    userEdit(req, res);
});

router.post('/update/:id', (req,res)=>{
    userUpdate(req, res);
});

router.post('/list/status', protectedRoute, (req,res)=>{
    statusChange(req, res);
});



module.exports = router