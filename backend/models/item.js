var self = this;

self.addItem = function(name,price,description,itemurl,categoryId,restId){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `insert into item(name,price,description,itemurl,categoryId,restId)
                    values ($1,$2,$3,$4,$5,$6) returning *`,
            values: [name,price,description,itemurl,categoryId,restId],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.listItems = function(categoryId,restId){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `select name,price,description,itemurl from items where categoryId = $1 and restId = $2`,
            values: [categoryId,restId],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows)
        })
        .catch(e => reject(e))
    });
}

self.updateName = function(name,new_name,restId){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `update item set name = $2 where name = $1 restId = $3`,
            values: [name,new_name,restId],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.updatePrice = function(price,name,restId){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `update item set price = $1 where name = $2 and restId = $3`,
            values: [price,name,restId],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.updateDescription = function(description,name,restId){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `update item set description = $1 where name = $2 and restId = $3`,
            values: [description,name,restId],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.updateUrl = function(Url,name,restId){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `update item set itemurl = $1 where name = $2 and restId = $3`,
            values: [Url,name,restId],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.deleteItem = function(name,restId){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `delete from item where name = $1 and restId = $2`,
            values: [name,restId],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

module.exports = self;