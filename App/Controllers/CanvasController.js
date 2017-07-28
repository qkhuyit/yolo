var express = require('express'),
    router = express.Router();


router.get('/love-thuyen-forever',(req,res) => {
    res.render('More/HungLe',{layout : false});
});

module.exports = router;