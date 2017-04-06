var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function (req, res, next) {
    res.render('signup', {
        user: req.user
    });
});

router.post('/', function(req, res) {
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err) {
        req.logIn(user, function(err) {
            res.redirect('/');
        });
    });
});

module.exports = router;
