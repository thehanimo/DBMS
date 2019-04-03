var self = this;

self.addOrderitem = function(orderId,ItemId,quantity){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `insert into orderItem(orderId,ItemId,quantity)
                    values ($1,$2,$3) returning *`,
            values: [orderId,ItemId,quantity],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}


self.listOrder = function(orderId){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text: `select itemId,quantity from orderItem where OrderId = $1`,
            values: [orderId],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows)
        })
        .catch(e => reject(e))
    });
}

module.exports = self;