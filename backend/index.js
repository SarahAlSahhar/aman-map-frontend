const http = require('http');
require('dotenv').config();

const app = require('./app'); 

const server = http.createServer(app);

server.listen(5000, () => {
    console.log('Server is running on port 5000');
})
