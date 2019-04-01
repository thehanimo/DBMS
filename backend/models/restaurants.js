var self = this;

self.restaurantApply = function(name, email, lon, lat){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `insert into restaurantApplications(name,email,lon,lat)
                    values ($1,$2,$3,$4) returning *`,
            values: [name,email,lon,lat],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.getRestaurantApplications = function(){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `select * from restaurantApplications`
        }
        client.query(query)
        .then(res => {
            resolve(res.rows)
        })
        .catch(e => reject(e))
    });
}
module.exports = self;