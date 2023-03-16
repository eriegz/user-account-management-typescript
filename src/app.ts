const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const clic = require('cli-color');

const CONFIG = require('./config');
const logger = require('./util/logger');

const authController = require('./routes/authController');
const userController = require('./routes/userController');
const versionController = require('./routes/versionController');

// Configure Express.js with our desired settings:
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// Configure our SSL options for HTTPS communication:
const sslConfig = {
  cert: fs.readFileSync(CONFIG.SSL_CERT_PATH),
  key: fs.readFileSync(CONFIG.SSL_KEY_PATH)
};

// Wire up our various endpoints:
app.use('/api', authController);
app.use('/api', userController);
app.use('/api', versionController);

// Display a welcome message in the console once on startup:
console.log(require('./banner.js').green);
console.log('      - Version:     ' + clic.yellow(CONFIG.VERSION));
console.log('      - Environment: ' + clic.yellow(process.env.NODE_ENV));
console.log('      - HTTP port:   ' + clic.yellow(CONFIG.HTTP_PORT));
console.log('      - HTTPS port:  ' + clic.yellow(CONFIG.HTTPS_PORT));
console.log('\n');

// Lastly, start listening to both HTTP and HTTPS incoming traffic:
const httpServer = http.createServer(app).listen(CONFIG.HTTP_PORT, () => {
  logger.info('Server listening to HTTP traffic on port', CONFIG.HTTP_PORT);
});
const httpsServer = https.createServer(sslConfig, app).listen(CONFIG.HTTPS_PORT, () => {
  logger.info('Server listening to HTTPS traffic on port', CONFIG.HTTPS_PORT);
});

module.exports = {
  app,
  httpServer,
  httpsServer,
};
