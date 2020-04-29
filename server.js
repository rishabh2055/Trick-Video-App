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

import db from './server/models';
import routes from './server/routes';

const app = express();

//parse requests of content-type - application/json
app.use(express.json());

//parse requests of content-type - application/x-wwww-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', routes);

db.sequelize.sync();

//simple route
app.get('*', (req, res) => {
  res.json({message: "Welcome to the Trick Video App"});
});

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

// view engine setup
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'pug');

//set port, listen  for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port:: ${PORT}`);
});

module.exports = app;
