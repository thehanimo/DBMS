var self = this;

self.restaurantApply = function(name, email, lon, lat, address, zipcode, phone, openingHrs, closingHrs, logourl){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `insert into restaurantApplications(name,email,lon,lat,address,zipcode,phone,openingHrs,closingHrs,logourl)
                    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *`,
            values: [name,email,lon,lat,address,zipcode,phone,openingHrs,closingHrs,logourl],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.getRestaurantApplicationByEmail = function(email){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `select * from restaurantApplications
                    where email = $1`,
            values: [email],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0]);
        })
        .catch(e => reject(e))
    });
}

self.getRestaurantApplications = function(){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `select name,email,phone,zipcode,id from restaurantApplications`
        }
        client.query(query)
        .then(res => {
            resolve(res.rows)
        })
        .catch(e => reject(e))
    });
}

self.getRestaurantApplicationByID = function(id){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `select * from restaurantApplications
                    where id = $1`,
            values: [id],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}

self.updateRestaurantApplication = function(email, status){
    client = this;
    return new Promise(function(resolve,reject){
        const query = {
            text:   `update restaurantApplications
                    set status = $1 where email = $2 returning *`,
            values: [status,email],
        }
        client.query(query)
        .then(res => {
            resolve(res.rows[0])
        })
        .catch(e => reject(e))
    });
}
module.exports = self;