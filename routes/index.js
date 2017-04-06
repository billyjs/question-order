var express = require('express');
var router = express.Router();

var List = require('../models/list');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.user) {
        List.find({ owner: req.user.username }, function(err, lists) {
            res.render('index', {
                title: 'Express',
                user: req.user,
                lists: lists
            });
        });
    } else {
        res.render('index', {
            title: 'Index',
        });
    }
});

module.exports = router;
