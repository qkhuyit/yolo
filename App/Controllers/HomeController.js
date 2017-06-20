var express = require('express'),
    router = express.Router(),
    AccountDAL = require('../DataAccess/AccountDAL'),
    Mapper = require('../Commons/Mapper'),
    Helper = require('../Commons/Helper'),
    nodemailer = require('nodemailer'),
    randomstring = require("randomstring");;

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'yolosoical@gmail.com',
        pass: 'qkhuy123'
    }
});


//GET HOME Page
router.get('/', (req, res, next) => {
    if (req.session.user) {
        res.render('Index', { layout: false, user: req.session.user });
    } else {
        res.redirect('/sign-in');
    }
});

//GET SIGN-UP Page
router.get('/sign-up', (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('Signup', { layout: false });
    }
});

//GET SIGN-IN Page
router.get('/sign-in', (req, res, next) => {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('Signin', { layout: false });
    }
});

//GET SIGN-OUT
router.get('/sign-out', function (req, res, next) {
    req.session.user = null;
    res.redirect('/sign-in');
});

//GET ERROR Page
router.get('/error', (req, res, next) => {
    res.render('Error', { layout: false });
});

//POST SIGN-UP
router.post('/sign-up', (req, res, next) => {
    AccountDAL.FindByEmail(req.body.Email).then((result) => {
        if (result) {
            res.render('Signup', { layout: false, Error: { Email: 'Email đã được đăng ký.' }, model: req.body });
        } else if (req.body.Password != req.body.RePassword) {
            res.render('Signup', { layout: false, Error: { RePassword: 'Xác nhận mật khẩu không đúng.' }, model: req.body });
        } else {
            var newAccount = Mapper.Account_Model(req.body);
            AccountDAL.Create(newAccount).then(function (result) {
                if (result) {
                    var data = {
                        Status: true,
                        Message: "Đăng ký tài khoản thành công."
                    }
                    res.render('Signup', { layout: false, Data: data });
                } else {
                    var data = {
                        Status: false,
                        Data: "Đăng ký thất bại."
                    }
                    res.render('Signup', { layout: false, model: user, Data: data });
                }
            }).catch(function (err) {
                if (err) {
                    console.log(err);
                    res.redirect('/error');
                }
            });
        }
    }).catch((err) => {
        console.log(err);
        res.redirect('/error');
    });
});

//POST Signin
router.post('/sign-in', function (req, res, next) {
    AccountDAL.FindByEmail(req.body.Email).then(function (result) {
        if (result) {
            if (result.Status == false) {
                res.render('Signin', { layout: false, error: 'Account Is Locked.', model: req.body });
            } else if (Helper.Compare_Password(req.body.Password, result.Password)) {
                req.session.user = result;
                res.redirect('/');
            } else {
                res.render('Signin', { layout: false, error: 'User name or password is not valid.', model: req.body });
            }
        } else {
            res.render('Signin', { layout: false, error: 'User name or password is not valid.', model: req.body });
        }
    }).catch(function (err) {
        if (err) {
            console.log(err);
            res.redirect('/error');
        }
    });
});

//GET Profile Page
router.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('Profile', { layout: false, user: req.session.user });
    } else {
        res.redirect('/sign-in');
    }
});

//POST Edit Avatar
router.post('/edit-avatar', (req, res, next) => {
    Helper.SaveBase64Image(req.body.avatar).then((result) => {
        AccountDAL.UpdateAvatar(req.session.user._id, result).then(acc => {
            if (acc) {
                req.session.user = acc;
                res.json({ Status: true, ImageUrl: result });
            }
        });
    }).catch((err) => {
        res.json({ Status: false, ImageUrl: null });
    });
});

//GET Forgot-Password
router.get('/forgot-password', (req, res) => {
    res.render('ForgotPassword', { layout: false });
});

//POST Forgot-Password
router.post('/forgot-password', (req, res) => {
    AccountDAL.FindByEmail(req.body.Email).then(result => {
        if (result) {
            var newPass = randomstring.generate(7);
            result.Password = Helper.Hash_Password(newPass);
            result.save();
            let mailOptions = {
                from: '"Yolo Social Network 👻" <qkhuyit@gmail.com>',
                to: req.body.Email,
                subject: 'Reset Password ✔',
                html: `<b>Mật khẩu mới của bạn là: </b> ${newPass}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
            res.render('ForgotPassword', { layout: false, success: 'Mật khẩu đã được cấp lại. Vui lòng kiểm tra email để biết thêm chi tiết.' });
        } else {
            res.render('ForgotPassword', { layout: false, error: 'Tài khoản không tòn tại.' });
        }
    }).catch(err => console.log(err));
});

//GET Tree
router.get('/tree', (req, res, next) => {
    res.render('Tree', { layout: false });
});

//GET Tree
router.get('/love-heart', (req, res, next) => {
    res.render('LoveHeart', { layout: false });
});

module.exports = router;
