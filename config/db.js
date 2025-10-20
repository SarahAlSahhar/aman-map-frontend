const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = mongoose.createConnection(process.env.DB_CONNECTION_STRING);

dbConnection.on('connected', () => console.log('connected'));

dbConnection.on('close', () => console.log('close'));

dbConnection.on('error', (err) => console.log('error', err));

module.exports = { dbConnection };
