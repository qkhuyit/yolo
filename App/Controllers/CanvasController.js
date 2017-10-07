var express = require('express'),
    router = express.Router();


router.get('/i-love-hien',(req,res) => {
    res.render('More/HungLe',{layout : false});
});

module.exports = router;
