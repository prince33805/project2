const express = require('express')
const router = express.Router()
require('dotenv').config()

//import models
const Transaction = require('../models/transactionModel')
const User = require('../models/userModel')

// MongoDB Atlas connection setting
const mongoose = require('mongoose')
const connStr = process.env.DATABASE_URL
                      .replace('<password>',process.env.DATABASE_PWD)
                      .replace('<database>',process.env.DATABASE_NAME)

mongoose.connect(connStr, { useNewUrlParser: true,
                            useUnifiedTopology: true,
                            useFindAndModify: false,
                            useCreateIndex: true })

const db = mongoose.connection
db.on('error', () => console.log('Database connection error'))
db.once('open', () => console.log('Database connected'))

//import authenication middleware
const auth = require('../middleware/auth')


/********** User Endpoints **********/
//register
router.post('/users', async (req,res) => {
  try {
    const user = new User(req.body)
    //trigger ".pre" middleware
    await user.save() 
    res.redirect('/');
    const token = await user.generateAuthToken() 
    res.status(201).json({ msg : 'add user successfull', user , token})
  } catch (error) {
    res.status(400).json({ error : error.msg})
  }
})

//login
router.post('/users/login',async (req,res) => {
  try {
    const { email, password } = req.body 
    const user = await User.findByCredentials(email,password)

    if(!user) {
      return res.status(401).json({ error: 'Login failed'})
    }

    const token = await user.generateAuthToken()
    res.status(200).json({token})

  } catch (error) {
    res.status(400).json ({ error: error.message})
  }
})

//profile
router.get('/users/me', auth, (req,res) => {
  const user = req.user
  res.status(201).json(user)
})

//logout
router.post('/users/logout', auth, async (req,res) => {
  const user = req.user
  const current_token = req.token

  try {
    user.tokens = user.tokens.filter( item => {
      return item.token !== current_token 
    })

    await user.save()
    res.status(201).json({ msg: 'log out successful'})

  } catch (error) {
    res.status(500).json({ error: error.message})
  }
})

//logoutall
router.post('/users/logoutall', auth, async (req,res) => {
  const user = req.user
  try {
    //remove item[0] to item [(n-1)]
    user.tokens.splice(0,user.tokens.length)
    await user.save()
  } catch (error) {
    res.status(500).json({ error: error.message})
  }
})



/********** Transaction Endpoints **********/
router.get('/transactions', auth, async (req,res,next) => {
  const user = req.user
  try {
    const transactions = await Transaction.find({ _uid: user._id})
    res.status(200).json(transactions)
  } catch (error) {
    res.status(500).json( {error: error.message})
  }
})

router.get('/transactions/:id', auth, async (req,res,next) => { 
  const user = req.user
  try {
    const t = await Transaction.find({ _id:req.params.id, _uid: user._id })
    if (!t) {
      res.status(404).json({ error:'transaction not found'})
    }
    res.status(200).json(t)
  } catch (error) {
    res.status(500).json( { error: error.message})  
  }
})

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

router.put('/transactions/:id', async (req,res,next) => { 
  const update_t = {
    name: req.body.name,
    amount: Number(req.body.amount),
    updated: new Date()
  }
  try {
    const t = await Transaction.findByIdAndUpdate(req.params.id, update_t, { new: true })
    if (!t) {
      res.status(404).json( { error: 'UPDATE::transaction not found'} )
    } else {
      res.status(200).json(t)
    }
  } catch (error) {
    res.status(500).json ( { error: 'UPDATE::'+error.message})
  }
})

//**************************************************
router.delete('/transactions/:id', auth, async (req,res,next) => {
  try {
    const user = req.user
    // const removeId = req.params.id; // รับค่า params จาก url 
    // const position = users.findIndex((val) => { // หา Index จาก array users
    //     return val.id == removeId;
    // });
    // users.splice(position, 1); // ลบสมาชิกใน array
    const t = await Transaction.findByIdAndDelete({ _id:req.params.id, _uid: user._id })
    return res.status(200).json( { message: 'Transaction deleted!'})
  } catch (error) {
    return res.status(404).json( { error: 'DELETE::transaction not found'}) 
  }
})
//**************************************************

module.exports = router
