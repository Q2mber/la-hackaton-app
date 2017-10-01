'use strict';

const express = require('express');
const logger = require('morgan');
const crypto = require('crypto');
const port = parseInt(process.env.PORT, 10) || 4220;
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const app = express();
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;


const bizNetworkConnection = new BusinessNetworkConnection();
const CONNECTION_PROFILE_NAME = 'hlfv1';
const businessNetworkIdentifier = 'hyper-file-storage';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// bizNetworkConnection.connect(CONNECTION_PROFILE_NAME, businessNetworkIdentifier, 'admin', 'adminpw')
//   .then((result) => {
//
//     businessNetworkDefinition = result;
//   }).then(result => {
//
//   businessNetworkConnection.on('DocumentUploadedEvent', (event) => {
//     console.log('DocumentUploadedEvent', event);
//   });
//
//   businessNetworkConnection.on('DocumentProcessedEvent', (event) => {
//     console.log('DocumentProcessedEvent', event);
//   });
//
//   businessNetworkConnection.on('event', (event) => {
//     console.log('event', event);
//   });
// });


/**
 * Default instructions
 */
app.use(logger('dev'));
app.use(express.static('./dist/'))

/**
 * Passport configure
 */

app.use(require('express-session')({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true
  }
}));


/**
 * Routes configure
 */
app.post('/api/file/upload', function (req, res) {
  console.log("UPLOAD")
  res.send({
    hash: 'hash',
    secret: 'secret'
  })
});

app.post('/api/io.devorchestra.kyc.Document/list', function (req, res) {
  console.log("BODY", req.body)
  return bizNetworkConnection.disconnect().then(result => {
    return bizNetworkConnection.connect(CONNECTION_PROFILE_NAME, businessNetworkIdentifier, req.body.userId, req.body.userSecret)
  })
    .then(result => {
      return bizNetworkConnection.getAssetRegistry('io.devorchestra.kyc.Document')
        .then((assetRegistry) => {
          return assetRegistry.getAll()
        })
        .then((result) => {
          const serializer = bizNetworkConnection.getBusinessNetwork().getSerializer();
          result = result.map(d => {
            return serializer.toJSON(d)
          })
          return res.send(result)
        }).catch(err => {
          console.log(err)
        });
    });

});

app.use('/*', express.static('./dist/index.html'));
//TODO HTTPS


/**
 * Error handler
 */
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log('baseUrl', req.baseUrl)
  console.log('body', req.body)
  console.log('path', req.path)
  console.log('route', req.route)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  // // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, function () {
  console.log('info', 'Express server listening on port ' + port);
  console.log('info', 'env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});

module.exports = app;
