var express = require('express'),
    router = express.Router();


router.get('/hung-y',(req,res) => {
    res.render('More/HungLe',{layout : false});
});

router.get('/tang-ban',(req,res) => {
    res.render('More/HungLe2',{layout : false});
});


module.exports = router;