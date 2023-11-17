const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const consumerKey = process.env.consumer_key
const consumerSecret = process.env.consumer_secret
const tokenId = process.env.token_id
const tokenSecret = process.env.token_secret
const account = process.env.realm
const url = `${process.env.domain}/app/site/hosting/restlet.nl?script=266&deploy=1&id=570785&type=purchaserequisition`
const method = 'GET'


const oauth = OAuth({
  consumer: {
    key: consumerKey,
    secret: consumerSecret
  },
  realm: account,
  signature_method: 'HMAC-SHA256',
  hash_function(base_string, key) {
    return crypto.createHmac('sha256', key).update(base_string).digest('base64');
  }
});

const request_data = {
  url: url,
  method: method
};

const token = {
  key: tokenId,
  secret: tokenSecret
};

const headers = oauth.toHeader(oauth.authorize(request_data, token));
headers['Content-Type'] = 'application/json';


// Axios GET request
axios({
  url: request_data.url,
  method: request_data.method,
  headers: headers,
})
  .then(response => response.data)
  .then(result => console.log(result))
  .catch(error => console.error(error));