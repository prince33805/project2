var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //req.flash("success", "Already saved");
    res.render("member");
});

module.exports = router;
