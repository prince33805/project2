var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv').config()

const db2 = require('monk')("mongodb+srv://Prince:Prince55@cluster0-ujsfk.gcp.mongodb.net/MyApp?retryWrites=true&w=majority")

//import models
const Transaction = require('../models/transactionModel')
const User = require('../models/userModel')

// MongoDB Atlas connection setting
const mongoose = require('mongoose')
const env = require('dotenv').config()
const connStr = process.env.DATABASE_URL
                      .replace('<password>',process.env.DATABASE_PWD)
                      .replace('<database>',process.env.DATABASE_NAME)

mongoose.connect(connStr, { useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useFindAndModify: false,
                            useCreateIndex: true 
})

const db = mongoose.connection
db.on('error', () => console.log('Database connection error'))
db.once('open', () => console.log('Database connected'))

//import authenication middleware
const auth = require('../middleware/auth')

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//     //req.flash("success", "Already signed up");
//     res.render("register");
// });

// /* GET users listing. */
// router.get('/add', function(req, res, next) {
//     res.render("addregister");
// });

/* POST users listing. */
// router.post('/add', [
//     check("name","Please put name").not().isEmpty(),
//     check("email","Please put email").not().isEmpty(),
//     check("name","Please put name").not().isEmpty()
// ] , function(req,res,next){
//         const result = validationResult(req);
//         var errors=result.errors;
//         if (!result.isEmpty()) {
//             res.render('addregister',{errors:errors});
//         }else{
//             var ct=db.get('users');
//             ct.insert({
//                 name:req.body.name,
//                 email:req.body.email,
//                 password:req.body.password
//             } , function (err,register) {
//                     if(err){
//                         res.send(err);
//                     }else{
//                         res.location('/register/add');
//                         res.redirect('/register/add');
//                     }
//             });
//         }
// });

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render("register");
});

/* GET users listing. */
router.get('/user', function(req, res, next) {
    res.render("addregister");
});

/********** User Endpoints **********/
router.post('/user', async (req,res) => {
    try {
      const user = new User(req.body)
      //trigger ".pre" middleware
      await user.save() 
      const token = await user.generateAuthToken() 
      //res.status(201).json({ msg : 'add user successfull', user , token})
      // alert("Register Successful");
      res.location('/');
      res.redirect('/');
    } catch (error) {
      res.status(400).json({ error : error.msg})
    }
})


module.exports = router;
