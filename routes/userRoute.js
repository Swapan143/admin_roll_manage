const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
    userList,
    getDataAjax,
    userAdd,
    userStore,
    userEdit,
    userUpdate
} = require('../controller/admin/UserController');

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/user/'); // Directory where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Filename format
    }
});

// Set up Multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        // Accept only image files
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});


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

router.post('/store', upload.single('image'), (req, res) => {
    userStore(req, res);
});


router.get('/edit/:id', protectedRoute, (req,res)=>{
    userEdit(req, res);
});

router.post('/update/:id', upload.single('image'), (req,res)=>{
    userUpdate(req, res);
});


// Handle form submission and pass data to controller
/*router.post('/submit-user-form', upload.single('image'), (req, res) => {
    //userAdd(req, res);
});*/



module.exports = router