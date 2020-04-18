const http = require('http');
const app = require('./app');

require('./bootstrap');

const port = process.env.PORT || 4000;

const server = http.createServer(app);
const io = require('socket.io')(server);
io.on('connection', (socket => {
  console.log('a user connected');
}));
server.listen(port);
module.exports = server;
