var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('login', {
        user: req.user
    });
});

router.post('/', function(req, res, next) {
    const successRedirect = req.query.next || "";
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/' + successRedirect);
        })
    })(req, res, next);
});

module.exports = router;
