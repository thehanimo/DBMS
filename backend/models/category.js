var self = this;

self.addCategory = function(name, rest_username){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `insert into category(categoryName,rest_username)
                    values ($1,$2) returning *`,
            values: [name,rest_username],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.listCategories = function(rest_username){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text: `select categoryName from category where rest_username = $1`,
            values: [rest_username],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows)
        })
        .catch(e => reject(e))
    });
}

module.exports = self;