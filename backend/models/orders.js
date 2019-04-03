var self = this;

self.addOrder = function(username,rest_name,lat,lon,del_username){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `insert into orders(username,rest_name,lat,lon,del_username)
                    values ($1,$2,$3,$4,$5) returning *`,
            values: [username,rest_name,lat,lon,del_username],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.deleteOrder = function(id,rest_name){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `delete from orders where id = $1 and rest_name = $2`,
            values: [id,rest_name],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.listOrder = function(rest_name){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text: `select username,del_username from orders where rest_name = $1`,
            values: [rest_name],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows)
        })
        .catch(e => reject(e))
    });
}

module.exports = self;