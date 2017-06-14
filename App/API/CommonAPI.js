var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        file.filename = 'abc';
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

router.post('/upload', upload.single("file"), function (req, res) {
    res.json(req.file.path);
});

module.exports = router;

