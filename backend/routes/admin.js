const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

require('../config/passport')(passport);
const db = require('../models/database');

router.get('/restaurant-applications', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        if (req.user.role === '2'){
            db.getRestaurantApplications()
                .then(resolve => {
                    return res.status(200).send(resolve)
                })
                .catch(e => {
                    console.log(e)
                    return res.status(403).send({success: false, msg: e})
                })
        }
    } else{
        return res.status(200).send({success: false, msg: 'Unauthorized'})
    }
        
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
