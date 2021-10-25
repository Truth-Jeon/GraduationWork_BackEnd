let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'graduation',
    password: 'graduate_201931042',
    database: 'graduationwork'
});

connection.connect();

connection.query('SELECT * from board', function(error, results, fields) {
    if(error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();