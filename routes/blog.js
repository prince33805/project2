var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

const db = require('monk')("mongodb+srv://Prince:Prince55@cluster0-ujsfk.gcp.mongodb.net/MyApp?retryWrites=true&w=majority")

/* GET users listing. */
router.get('/', function(req, res, next) {
    //req.flash("success", "Already saved");
    res.render("blog");
});

/* GET users listing. */
router.get('/add', function(req, res, next) {
    res.render("addblog");
  });

/* POST users listing. */
router.post('/add', [
    check("name","Please put your blog name").not().isEmpty(),
    check("description","Please put your des").not().isEmpty(),
    check("author","Please put your author's name").not().isEmpty()

] , function(req, res, next) {
        const result = validationResult(req);
        var errors=result.errors;
        if (!result.isEmpty()) {
            res.render('addblog',{errors:errors});
        }else{
            //insert to db
            var ct=db.get('blogs');
            ct.insert({
                name:req.body.name,
                description:req.body.description,
                author:req.body.author
            },function(err,blog){
                if(err){
                    res.send(err);
                }else{
                    //req.flash("success", "Already saved");
                    res.location('/blog/add');
                    res.redirect('/blog/add');
                } 
            });
        }
});

module.exports = router;
