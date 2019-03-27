const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

require('../config/passport')(passport);
const db = require('../models/database');


router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
      res.status(400).send({msg: 'Please pass username and password.'})
    } else {
        db.insertUser(req.body.username,req.body.password)
            .then((user) => res.status(201).send(user))
            .catch((error) => {
                console.log(error);
                res.status(400).send(error);
            });
    }
});

router.post('/signin', function(req, res) {
    db.getUser(req.body.username)
        .then((user) => {
            if (!user) {
                return res.status(401).send({
                message: 'Authentication failed. User not found.',
                });
            }
            db.comparePassword(user,req.body.password, (err, isMatch) => {
                if(isMatch && !err) {
                    var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
                    jwt.verify(token, 'nodeauthsecret', function(err, data){
                        //console.log(err, data);
                    })
                    res.json(JSON.parse('{"success": true, "token": "JWT ' + token + '", ' + JSON.stringify(user).slice(1)));
                } else {
                    res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            })
        })
        .catch((error) => res.status(400).send(error));
});

router.get('/product', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        return res.status(200).send({success: true, msg: 'Authorized.'});
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});
  
router.post('/product', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        return res.status(200).send({success: true, msg: 'Authorized.'});
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});


getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = router;