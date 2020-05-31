import http from 'http';
import https from 'https';
// Express is for building the Rest apis
import express from 'express';
// body-parser helps to parse the request and create the req.body object
import bodyParser from 'body-parser';
// HTTP request logger middleware for node.js
import morgan from 'morgan';
// Helmet helps us to secure our Express apps by setting various HTTP headers.
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import socket from 'socket.io';
import jwt from 'jsonwebtoken';
import fs from 'fs';
const options = {
  key: fs.readFileSync('./file.pem'),
  cert: fs.readFileSync('./file.crt')
};

import db from './server/models';
import routes from './server/routes';
import config from './server/config/auth.config';

const app = express();

//parse requests of content-type - application/json
app.use(express.json());

//parse requests of content-type - application/x-wwww-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', routes);

db.sequelize.sync();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

/**
 * disable Helmet's caching - because we control that directly - caching is not enabled by default; but explicitly disabling it here
 * set frame policy to deny
 * only use on '/api' endpoint, because these changes may otherwise impact on the UI.
 */
app.use('/api', helmet({
  noCache: false,
  frameguard: {
      action: 'deny'
  },
  contentSecurityPolicy : {
      directives: {
          defaultSrc: ["'self'"]
      }
  }
}));

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// view engine setup
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'pug');

//set port, listen  for requests
const PORT = process.env.PORT || 4000;
const SECURE_PORT = process.env.PORT || 3000;
const server = http.createServer( options, app ).listen( PORT, function() {
  console.log(`Server is running on port:: ${PORT}`);
});

https.createServer( options, app ).listen( SECURE_PORT, function() {
  console.log(`Secure Server is running on port:: ${SECURE_PORT}`);
});

// Socket setup
const io = socket(server);
io.set("transports", ["xhr-polling","websocket","polling", "htmlfile"]);

// middleware
io.use((socket, next) => {
  let token = socket.handshake.query.token;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.error("Token not valid");
      return next(new Error('authentication error'));
    }
    socket.user = decoded;
    next();
  });
  return next(new Error('authentication error'));
});

let activeSockets = [];
let callRoomName;

io.on('connection', (socket) => {
  const existingSocket = activeSockets.find(
    existingSocket => existingSocket.user.id === socket.user.id
  );

  if (!existingSocket) {
    activeSockets.push(socket);
  }else{
    activeSockets.map((existingSocket, index) => {
      if(existingSocket.user.id === socket.user.id){
        activeSockets.splice(index, 1);
        activeSockets.push(socket);
      }
    });
  }
  const returnSockets = [];
  for(let socketId in activeSockets){
    returnSockets.push({
      user: activeSockets[socketId].user,
      socketId: activeSockets[socketId].id
    })
  }
  io.emit('AllActiveClients', returnSockets);

  socket.on('room_join_request', payload => {
    callRoomName = payload.roomName;
    socket.join(payload.roomName, err => {
        if (!err) {
            io.in(payload.roomName).clients((err, clients) => {
                if (!err) {
                    io.in(payload.roomName).emit('room_users', clients)
                }
            });
        }
    })
  });

  socket.on("Offer", (data) => {
    io.to(data.callee).emit("BackOffer", {
      offer: data.offer,
      roomName: data.roomName,
      caller: data.caller,
      callee: data.callee,
      callerDetails: socket.user
    });
  });

  socket.on("Answer", data => {
    io.to(data.caller).emit("BackAnswer", {
      socket: socket.id,
      answer: data.answer,
      caller: data.caller,
      callee: data.callee,
      calleeDetails: socket.user
    });
  });

  socket.on('Disconnect', (data) => {
    activeSockets = activeSockets.filter(
      existingSocket => existingSocket === data.caller
    );
    if(data.callee){
      io.to(data.callee).emit('OnDisconnect', { type: 'disconnected', socketId: socket.id });
    }
  });
  socket.on('chat-info', (chatData) => {
    io.to(chatData.reciever).emit('chat-data', chatData);
  });
});
module.exports = app;
