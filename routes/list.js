var express = require('express');
var router = express.Router();

var List = require('../models/list');

// open endpoints
router.get('/:listid', function (req, res) {
    List.findOne({ listid: req.params.listid }, function(err, list) {
        if (list) {
            res.render('listView', {
                user: req.user,
                list: list,
                owner: (req.user && req.user.username == list.owner)
            });
        } else {
            req.flash('List does not exist');
            res.redirect('/list');
        }

    });
});


// authenticated endpoints
router.get('/', ensureAuth, function(req, res) {
    res.render('list', {
        user: req.user
    });
});

router.post('/', ensureAuth, function(req, res) {
    var list = new List({
        owner: req.user.username,
        listid: req.body.listid
    });

    console.log(list);

    list.save(function(err) {
        if (err) throw err;
        res.redirect('/list/' + list.listid);
    });
});

// restricted endpoints - password needed

router.post('/:listid', function(req, res, next) {
    if (!req.body.item || !req.body.password) {
        return res.redirect('/list/' + req.params.listid);
    }

    List.findOneAndUpdate({ listid: req.params.listid , password: req.body.password },
            { $push: {"items": req.body.item} }, function(err) {
        if (err) next(err);
        res.redirect('/list/' + req.params.listid);
    });
});

// restricted endpoints - owner only

router.post('/:listid/password', function(req, res, next) { // update list password
    if (!req.body.password) {
        return res.redirect('/list/' + req.params.listid);
    }

    List.findOneAndUpdate({ listid: req.params.listid, owner: req.user.username },
            { password: req.body.password }, function(err) {
        if (err) next(err);
        res.redirect('/list/' + req.params.listid);
    })
});

router.post('/:listid/pop', function(req, res, next) { // pop top list item

    List.findOneAndUpdate({ listid: req.params.listid, owner: req.user.username },
                { $pop: { "items": -1 } }, function(err) {
            if (err) next(err);
            res.redirect('/list/' + req.params.listid);
        })
});

router.post('/:listid/clear', function(req, res, next) { // clear list

    List.findOneAndUpdate({ listid: req.params.listid, owner: req.user.username },
        { "items": [] }, function(err) {
            if (err) next(err);
            res.redirect('/list/' + req.params.listid);
        })
});

// router.post('/:listid/remove/:index', function(req, res, next) {
//     var index = parseInt(req.params.index);
//     if (index < 0) {
//         return res.redirect('/list/' + req.params.listid);
//     }
//
//     List.findOne({ listid: req.params.listid, owner: req.user.username }, function(err, list) {
//         if (err) next(err);
//         if (list) {
//             list.items.splice(index, 1);
//             list.save(function(err) {
//                 if (err) next(err);
//             });
//         }
//         res.redirect('/list/' + req.params.listid);
//     });
//
// });

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login?next=list');
    }
}

module.exports = router;
