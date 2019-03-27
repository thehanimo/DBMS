const { Client } = require('pg');
const users = require('./users');
const client = new Client({
    user: 'dbms',
    host: 'localhost',
    database: 'db',
    password: 'password',
    port: 5432,
})

client.setup = function() {
    const query = {
        text: `create table if not exists users(
            id serial,
            username varchar(255) primary key,
            password varchar(10000) not null,
            role varchar(2) default '1',
            created timestamp,
            modified timestamp
            );
            drop trigger if exists add_created_timestamp on users;
            drop trigger if exists add_modified_timestamp on users;

            CREATE OR REPLACE FUNCTION created_timestamp() 
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.created = now();
                NEW.modified = now();
                RETURN NEW; 
            END;
            $$ language 'plpgsql';

            CREATE OR REPLACE FUNCTION modified_timestamp() 
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.created = OLD.created;
                NEW.modified = now();
                RETURN NEW; 
            END;
            $$ language 'plpgsql';

            
            create trigger add_created_timestamp
            before insert on users
            for each row
            execute procedure created_timestamp();
            
            create trigger add_modified_timestamp
            before update on users
            for each row
            execute procedure modified_timestamp();`,
    }
    this.query(query)
    .then(res => {
        console.log(res.command)
    })
    .catch(e => console.log(e.stack))
};

client.connect();
client.insertUser = users.insertUser;
client.getUser = users.getUser;
client.updateUser = users.updateUser;
client.deleteUser = users.deleteUser;
client.comparePassword = users.comparePassword;
module.exports = client;