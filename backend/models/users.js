var self = this;
var bcrypt = require('bcrypt-nodejs');



self.insertUser = function(username,password){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `insert into users(username,password)
                    values ($1,$2)`,
            values: [username,bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)],
        }
        client.query(query)
        .then(res => {
            resolve(client.getUser(username))
        })
        .catch(e => reject(e))
    });
}

self.getUser = function(username){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `select * from users
                    where username = $1`,
            values: [username],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0]);
        })
        .catch(e => reject(e))
    });
}

self.updateUser = function(username,newusername,password){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `update users
                    set username = $1, password = $2,
                    where username = $3`,
            values: [newusername,bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),username],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.deleteUser = function(username){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `delete from users
                    where username = $1`,
            values: [username],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.comparePassword = function(user,password,callback){
    bcrypt.compare(password,user.password, (err, isMatch) => {
        return callback (err, isMatch);
    })
}
module.exports = self;