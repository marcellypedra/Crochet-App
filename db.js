const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Viajantes*01',  //NEED TO BE UPDATE FOR SETUP LOCAL
    database: 'Crochet_App',   
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = { promisePool };
