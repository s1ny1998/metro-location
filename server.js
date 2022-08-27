'use strict';

require('dotenv').config();
const config = require('config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const socketIo = require('socket.io');
const { createServer } = require('http');
const clientManager = require('./clientManager');

require('./app/db');

const PORT = process.env.NODE_PORT || 3000;
const IP = config.get('IP');
const app = express();

const httpServer = createServer(app);
const io = socketIo(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./app/routes')(app);

const onServerStart = () => {
  const ENVIROINMENT = process.env.NODE_ENV || 'development';
  const message = `Server Listening On Port ${PORT}, ENVIROINMENT=${ENVIROINMENT}`;
  // eslint-disable-next-line no-console
  console.log(message);
};

// let socket = io();

io.on('connection', async (socket) => {
  const { userId } = socket.handshake.query;
  clientManager.addUser(userId, socket);
  // clientManager.joinAllConversations(userId)
  socket.on('currentLocation', (msg) => {
    if (typeof msg !== 'string') {
      console.log(msg.to);
      clientManager.getUser(msg.to).emit('currentLocation', msg);
    }
  });
  socket.on('distance', (data) => {
    if (typeof data !== 'string') {
      const distance = clientManager.distanceBetweenLines(
        data.data.current,
        data.data.end,
        data.data.line,
      );
      clientManager.getUser(data.to).emit('distance', distance.toFixed(3));
    }
  });
  socket.on('online', (userId) => {
    socket.broadcast.emit('online', { userId: userId.userId, status: 'online' });
  });
  socket.on('offline', (userId) => {
    socket.broadcast.emit('offline', { userId: userId.userId, status: 'offline' });
  });
  socket.on('disconnect', () => {
    console.log('Disconnected - ', userId); // undefined
  });
});

httpServer.listen(PORT, IP, onServerStart);
