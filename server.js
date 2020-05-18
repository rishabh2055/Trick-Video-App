import http from 'http';
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
const PORT = process.env.PORT || 3000;
const server = http.createServer( app ).listen( PORT, function() {
  console.log(`Server is running on port:: ${PORT}`);
});

// Socket setup
const io = socket(server);

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

io.on('connection', (socket) => {
  console.log('inside connection')
  const sockets = io.sockets.sockets;
  const returnSockets = [];
  for(let socketId in sockets){
    returnSockets.push({
      user: sockets[socketId].user,
      socketId: sockets[socketId].id
    })
  }
  io.emit('all_clients', returnSockets);
  console.log('Made socket connection', socket.id);
  socket.on('room_join_request', payload => {debugger
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

  socket.on("call_user", (data) => {
    io.in(data.roomName).emit("call_made", {
      offer: data.offer,
      roomName: data.roomName,
      caller: data.caller,
      callee: data.callee
    });
  });

  socket.on("make_answer", data => {
    io.to(data.to).emit("answer_made", {
      socket: socket.id,
      answer: data.answer
    });
  });

  socket.on('answer_signal', payload => {
      io.to(payload.callerId).emit('answer', { signalData: payload.signalData, calleeId: socket.id });
  });

  socket.on('disconnect', () => {
      io.emit('room_left', { type: 'disconnected', socketId: socket.id })
  })
  socket.on('chat-info', (chatData) => {
    io.emit('chat-data', chatData);
  });
});

module.exports = app;
