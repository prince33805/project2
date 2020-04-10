var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

const db = require('monk')("mongodb+srv://Prince:Prince55@cluster0-ujsfk.gcp.mongodb.net/MyApp?retryWrites=true&w=majority")

//import models
const Transaction = require('../models/transactionModel')
const User = require('../models/userModel')


//import authenication middleware
const auth = require('../middleware/auth')

/* GET users listing. */
router.get('/', function(req, res, next) {
    //req.flash("success", "Already saved");
    res.render("logout");
});

/* GET users listing. */
router.get('/user', function(req, res, next) {
    res.render("logout");
  });

//logout
router.post('/user/logout', auth, async (req,res) => {
    const user = req.user
    const current_token = req.token
  
    try {
      user.tokens = user.tokens.filter( item => {
        return item.token !== current_token 
      })
  
      await user.save()
      res.status(201).json({ msg: 'log out successful'})
      res.location('/logout');
      res.redirect('/logout');
  
    } catch (error) {
      res.status(500).json({ error: error.message})
    }
  })

module.exports = router;
