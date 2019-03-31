const { Client } = require('pg');
const users = require('./users');
const userProfile = require('./userProfile');
const verification = require('./verification');
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
            isActive boolean default false,
            username varchar(255) primary key,
            email varchar(255) NOT NULL UNIQUE,
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
            execute procedure modified_timestamp();
            
            CREATE TABLE if not exists userProfile (
                username varchar(255),
                firstname varchar(255) NOT NULL,
                lastname varchar(255) NOT NULL,
                phone varchar(255) NOT NULL,
                address varchar(1000) NOT NULL,
                pictureurl varchar(500),
                PRIMARY KEY (username),
                FOREIGN KEY (username) REFERENCES users (username)
               );

            CREATE TABLE if not exists verification (
            username varchar(255),
            token varchar(1000),
            PRIMARY KEY (token),
            FOREIGN KEY (username) REFERENCES users (username)
            );
            `,
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
client.getUnverifiedUser = users.getUnverifiedUser;
client.getUserByEmail = users.getUserByEmail;
client.updateUser = users.updateUser;
client.deleteUser = users.deleteUser;
client.comparePassword = users.comparePassword;
client.changePassword = users.changePassword;

client.insertUserProfile = userProfile.insertUserProfile;
client.getUserProfile = userProfile.getUserProfile;
client.updateUserProfile = userProfile.updateUserProfile;
client.deleteUserProfile = userProfile.deleteUserProfile;
client.getUsers = users.getUsers;
client.setActive = users.setActive;

client.insertNewToken = verification.insertNewToken;
client.verifyToken = verification.verifyToken;
client.verified = verification.verified;
module.exports = client;