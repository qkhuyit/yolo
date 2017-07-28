var express = require('express'),
    router = express.Router();


router.get('/hung-y',(req,res) => {
    res.render('More/HungLe',{layout : false});
});

module.exports = router;