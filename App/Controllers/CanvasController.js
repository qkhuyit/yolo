var express = require('express'),
    router = express.Router();


router.get('/hoa-nang-cua-anh',(req,res) => {
    res.render('More/HungLe',{layout : false});
});

module.exports = router;
