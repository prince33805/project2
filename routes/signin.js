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
    res.render("signin");
});

/* GET users listing. */
router.get('/user', function(req, res, next) {
    res.render("addsignin");
  });


// router.post('/user', async (req,res) => {
//   try {
//     const user = new User(req.body)
//     //trigger ".pre" middleware
//     await user.save() 
//     res.redirect('/');
//     const token = await user.generateAuthToken() 
//     res.status(201).json({ msg : 'add user successfull', user , token})
//   } catch (error) {
//     res.status(400).json({ error : error.msg})
//   }

// })


// router.post('/user',async (req,res) => {
//   try {
//     const { email, password } = req.body 
//     const user = await User.findByCredentials(email,password)
  
//     if(!user) {
//       return res.status(401).json({ error: 'Login failed'})
//     }
    
//     const token = await user.generateAuthToken()
//     //res.status(200).json({token})
//     res.location('/');
//     res.redirect('/');

//   } catch (error) {
//     res.status(400).json ({ error: error.message})
//   }
// })

//login
router.post('/user/login',async (req,res) => {
  try {
    const { email, password } = req.body 
    const user = await User.findByCredentials(email,password)

    if(!user) {
    res.location('/failed');
    res.redirect('/failed');
      // return res.status(401).json({ error: 'Login failed'})
    }

    const token = await user.generateAuthToken()
    
    res.location('/member');
    res.redirect('/member');
    res.status(200).json({token});
  } catch (error) {
    res.status(400).json ({ error: error.message})
  }
})

//profile
router.get('/user/me', (req,res) => {
  const user = req.user
  res.status(201).json(user)
  res.render('me');
})

//logout
router.post('/user/logout', async (req,res) => {
  const user = req.user
  //const current_token = req.token

  try {
    // user.tokens = user.tokens.filter( item => {
    //   return item.token !== current_token 
    // })

    //await user.save()
    //res.status(201).json({ msg: 'log out successful'})
    res.location('/logout');
    res.redirect('/logout');

  } catch (error) {
    res.status(500).json({ error: error.message})
  }
})

/********** Transaction Endpoints **********/
router.post('/transactions', auth, async (req,res) => {
  const user = req.user
  const t = new Transaction(req.body) // { name: 'something', amount: 1000 }
  t._uid = user._id

  try {
    await t.save()
    res.status(200).json(t)
  } catch (error) {
    res.status(500).json( { error: error.message})
  }
})

router.get('/transactions', function(req, res, next) {
  res.render("food1");
});

module.exports = router;
