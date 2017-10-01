'use strict';

const express = require('express');
const logger = require('morgan');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const multer         = require('multer');
const fileUpload = require('express-fileupload');
const ipfsAPI = require('ipfs-api')
const async = require('async');


const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const bizNetworkConnection = new BusinessNetworkConnection();
const CONNECTION_PROFILE_NAME = 'hlfv1';
const businessNetworkIdentifier = 'hyper-file-storage';


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
 *  IPFS
 */

// connect to ipfs daemon API server
let ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values

/**
 * EXPRESS
 */
const port = parseInt(process.env.PORT, 10) || 65533;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

app.post('/api/io.devorchestra.kyc.Document/process', function (req, res) {
  return bizNetworkConnection.disconnect().then(result => {
    return bizNetworkConnection.connect(CONNECTION_PROFILE_NAME, businessNetworkIdentifier, req.body.userId, req.body.userSecret)
  })
    .then(result => {
      return bizNetworkConnection.getAssetRegistry('io.devorchestra.kyc.Document')
        .then((assetRegistry) => {
          return assetRegistry.get(req.body.document.documentId)
        }).then(doc=>{
          let serializer = bizNetworkConnection.getBusinessNetwork().getSerializer();
          console.log(req.body.status)
          let resource = serializer.fromJSON({
            '$class': 'io.devorchestra.kyc.ProcessDocument',
            'status':req.body.status,
            'document':req.body.document.documentId
          });

          return bizNetworkConnection.submitTransaction(resource);
        })
        .then((result) => {
          return res.send({error:false})
        }).catch(err => {
          console.log(err)
        });
    });

});

app.post('/api/ipfs/file', multer({inMemory: true}).single('ipfsFile'),function (req, res, next) {
  console.log("UPLOAD");
  if (!req.file) return res.sendStatus(400);
  console.log(req.file.buffer);
  let secret = crypto.randomBytes(12).toString('hex');
  let crypted = encrypt(req.file.buffer, secret);
  ipfs.files.add(crypted, (err, answ) => {
    if (err) return next(err);
    let hash = answ[0].hash;
    res.send({hash, secret});
  });
});

app.get('/api/ipfs/file', function (req, res, next) {
  console.log("GET");
  let {secret, hash} = req.query;
  ipfs.files.cat(hash, (err, stream) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    let decrypt = crypto.createDecipher('aes-256-ctr', secret);
    stream.pipe(decrypt).pipe(res);
  });
});
app.use('/*', express.static('./dist/index.html'));
//TODO HTTPS


app.use((req, res) => {
  res.sendStatus(404);
});

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
  res.sendStatus(err.status || 500);
});


app.listen(port, function () {
  console.log('info', 'Express server listening on port ' + port);
  console.log('info', 'env = ' + app.get('env') +
    '\n__dirname = ' + __dirname +
    '\nprocess.cwd = ' + process.cwd());
});

module.exports = app;


function encrypt(buffer, secret){
  let cipher = crypto.createCipher('aes-256-ctr', secret)
  let crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
  return crypted;
}
