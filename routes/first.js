var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('first');
  });

var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

const db = require('monk')("mongodb+srv://Prince:Prince55@cluster0-ujsfk.gcp.mongodb.net/MyApp?retryWrites=true&w=majority")

//import models
const Transaction = require('../models/transactionModel')
const User = require('../models/userModel')


//import authenication middleware
const auth = require('../middleware/auth')

/********** Transaction Endpoints **********/
router.get('/transactions1', function(req, res, next) {
  res.render("food1");
});

// router.post('/transactions1', async (req,res) => {
//   const user = req.user
//   const t = new Transaction(req.body) // { name: 'something', amount: 1000 }
//   // t._uid = user._id

//   try {
//     await t.save()
//     res.status(200).json(t)
//     res.render("/index2");
//   } catch (error) {
//     res.status(500).json( { error: error.message})
//   }
// })

/* POST users listing. */
router.post('/transactions1', [
  check("name","Please put your food's name").not().isEmpty(),
  check("cost","Please put cost").not().isEmpty(),
  check("amount","Please put amount").not().isEmpty(),
] , function(req, res, next) {
      const result = validationResult(req);
      var errors=result.errors;
      if (!result.isEmpty()) {
          res.render('food1',{errors:errors});
      }else{
          //insert to db
          var ct=db.get('transactions');
          ct.insert({
              name:req.body.name,
              cost:req.body.cost,
              amount:req.body.amount,
              created: { type: Date , required: true , default: Date.now },
              updated: { type: Date , required: true , default: Date.now },
          },function(err,blog){
              if(err){
                  res.send(err);
              }else{
                  // req.flash("success", "Already ordered");
                  res.location('/rider');
                  res.redirect('/rider');
              } 
          });
      }
});

module.exports = router;
