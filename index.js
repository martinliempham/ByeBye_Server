const express = require('express');
const app = express();
const dotenv = require('dotenv');
// const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const request = require('request');

const cfg = {};
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
dotenv.config({ path: '.env' });

cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER;

const client = new twilio(cfg.accountSid, cfg.authToken);

const requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
const isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

if (!isConfigured) {
  const errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';
  throw new Error(errorMessage);
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/message', (req, res) => {
  console.log('REQUEST ', req);
  let toNumber = req.body.contact,
    message = req.body.message;

  client.messages.create(
    {
      to: toNumber,
      from: cfg.sendingNumber,
      body: message
    },
    (err, apiResponse) => {
      if (err) {
        console.error('There was an error making the text: ', err);
      }
      res.set('Content-Type', 'application/xml');
      res.send('<Response/>');
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    port,
    app.settings.env
  );
});

// setInterval(() => {
//   http.get('https://frozen-ridge-66479.herokuapp.com/');
// }, 300000);
