require('dotenv').config();

const axios = require('axios');
const querystring = require('querystring');
const smartSensor = {};

const postData = querystring.stringify({
  'grant_type': 'api_key',
  'api_key': process.env.ABB_API_KEY
});

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData),
    'accept': 'application/json'
};  
const auth_url = process.env.ABB_API_AUTH_URL;  

async function auth() {
  return axios.post(auth_url, postData, { headers })   
    .then(response => {
      return response
    })
    .catch(error => {
      console.log(error);
    });
}

smartSensor.auth = auth;

module.exports = smartSensor;
