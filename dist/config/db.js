"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Create a connection
const connection = mysql.createConnection({
    host: 'localhost', // Replace with your host
    user: 'root', // Replace with your database user
    password: 'password', // Replace with your database password
    database: 'my_database' // Replace with your database name
});
// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});
// Example query
connection.query('SELECT * FROM my_table', (err, results, fields) => {
    if (err) {
        console.error('Error executing query:', err.message);
        return;
    }
    console.log('Query results:', results);
});
// Close the connection
connection.end();
