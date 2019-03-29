const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const fs = require('fs');
const path = require('path');

require('../config/passport')(passport);
const db = require('../models/database');


router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password || !req.body.email) {
      res.status(400).send({msg: 'Incomplete details.'})
    } else {
        db.insertUser(req.body.username,req.body.password,req.body.email)
            .then((user) =>{
                var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
                jwt.verify(token, 'nodeauthsecret', function(err, data){
                    //console.log(err, data);
                })
                res.json(JSON.parse('{"success": true, "token": "JWT ' + token + '", ' + JSON.stringify(user).slice(1)));
            })
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

router.get('/users', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token && req.user.role === '2') {
        db.getUsers()
        .then(resolve => {
            return res.status(200).send(resolve)
        })
        .catch(e => {
            console.log(e)
            return res.status(403).send({success: false, msg: 'Unauthorized.'})
        })
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/username', function(req, res) {
    db.getUser(req.body.username)
    .then(resolve => {
        return res.status(200).send(resolve === undefined)
    })
    .catch(e => {
        console.log(e)
        return res.status(404).send({message: "Server down."})
    })
});

router.post('/email', function(req, res) {
    db.getUserByEmail(req.body.email)
    .then(resolve => {
        return res.status(200).send(resolve === undefined)
    })
    .catch(e => {
        console.log(e)
        return res.status(404).send({message: "Server down."})
    })
});


router.get('/user', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        db.getUserProfile(req.user.username)
        .then(resolve => {
            if(resolve.hasOwnProperty("pictureurl")){
                fs.readFile(resolve.pictureurl, function read(err, data) {
                    if (err) {
                        return res.status(403).send({success: false, msg: 'Unauthorized.'})
                    }
                    resolve.picture = data.toString();
                    delete resolve["pictureurl"]
                    return res.status(200).send(resolve)
                });
            } else {
            return res.status(200).send(resolve)
            }
        })
        .catch(e => {
            console.log(e)
            return res.status(403).send({success: false, msg: 'Unauthorized.'})
        })
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});
  
router.post('/user', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        if(req.body.options.hasOwnProperty('picture')){
            const pictureurl = __dirname + "/../models/pictures/" + req.user.id
            console.log(pictureurl)
            fs.writeFile(pictureurl, req.body.options.picture, function(err) {
                if(err) {
                    return res.status(403).send({success: false, msg: 'Unauthorized.'})
                }
                req.body.options.pictureurl = pictureurl;
                db.getUserProfile(req.user.username)
                .then(resolve => {
                    if(resolve.hasOwnProperty("username")){
                        db.updateUserProfile(req.user.username,req.body.options)
                        .then(resolve => {
                            return res.status(200).send({success: true, msg: 'Updated.'});
                        })
                        .catch(e => {
                            console.log(e)
                            return res.status(403).send({success: false, msg: 'Unauthorized.'})
                        })
                    } else {
                        db.insertUserProfile(req.user.username,req.body.options)
                        .then(resolve => {
                            return res.status(200).send({success: true, msg: 'Updated.'});
                        })
                        .catch(e => {
                            console.log(e)
                            return res.status(403).send({success: false, msg: 'Unauthorized.'})
                        })
                    }
                })
            }); 
        } else {
            db.getUserProfile(req.user.username)
            .then(resolve => {
                if(resolve.hasOwnProperty("username")){
                    db.updateUserProfile(req.user.username,req.body.options)
                    .then(resolve => {
                        return res.status(200).send({success: true, msg: 'Updated.'});
                    })
                    .catch(e => {
                        console.log(e)
                        return res.status(403).send({success: false, msg: 'Unauthorized.'})
                    })
                } else {
                    db.insertUserProfile(req.user.username,req.body.options)
                    .then(resolve => {
                        return res.status(200).send({success: true, msg: 'Updated.'});
                    })
                    .catch(e => {
                        console.log(e)
                        return res.status(403).send({success: false, msg: 'Unauthorized.'})
                    })
                }
            })
        }
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});

router.post('/user/picture', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        db.getUserProfile(req.user.username)
        .then(resolve => {
            if(resolve.hasOwnProperty("pictureurl")){
                fs.readFile(resolve.pictureurl, function read(err, data) {
                    if (err) {
                        return res.status(404).send({picture: "Not found"})
                    }
                    resolve.picture = data.toString();
                    return res.status(200).send(resolve.picture)
                });
            }
            else{
                return res.status(404).send({picture: "Not found"})
            }
        })
        .catch(e => {
            console.log(e)
            return res.status(404).send({picture: "Not found"})
        })
    } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
})

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