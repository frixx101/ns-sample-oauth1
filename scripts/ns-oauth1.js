const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');
const dotenv = require('dotenv');
const { type } = require('os');
dotenv.config();

const METHOD = 'GET'
const GET_PARAMS = {
  id: 570785,
  type: 'purchaserequisition'
}
const POST_BODY = {
  id: '570785',
  type: 'purchaserequisition',
  fields: {
    memo: "Updated memo 1",
  },
  sublists: [
    {
      sublistId: 'item',
      data: [
        {
          custcol_bom_deptcode: '00011'
        }
      ]
    }
  ]
}

const consumerKey = process.env.consumer_key
const consumerSecret = process.env.consumer_secret
const tokenId = process.env.token_id
const tokenSecret = process.env.token_secret
const account = process.env.realm
let url = `${process.env.domain}/app/site/hosting/restlet.nl?script=430&deploy=1`
if(METHOD === 'GET') {
  url += `&id=${GET_PARAMS.id}&type=${GET_PARAMS.type}`
}

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
  method: METHOD
};

const token = {
  key: tokenId,
  secret: tokenSecret
};

const headers = oauth.toHeader(oauth.authorize(request_data, token));
headers['Content-Type'] = 'application/json';

if(METHOD === 'GET') {
  axios({
    url: request_data.url,
    method: request_data.method,
    headers: headers,
  })
    .then(response => response.data)
    .then(result => console.log(result))
    .catch(error => console.error(error));
}

if(METHOD === 'POST') {
  axios({
    url: request_data.url,
    method: request_data.method, 
    headers: headers,
    data: JSON.stringify(POST_BODY)
  })
    .then(response => response.data)
    .then(result => console.log('result:', result))
    .catch(error => console.error(error));
}