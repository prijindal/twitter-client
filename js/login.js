const jQuery = require('jquery');
const randomstring = require('randomstring');
var crypto = require('crypto');
const OAuth = require('oauth');
const Codebird = require('codebird');

const CONSUMER_KEY = '9NjY4wu59Mz7PlAOUej6PFBlb'
const CONSUMER_SECRET = 'Rp6ujmVuA9dhX47nuxvPUNXoWdTW4FtrZubiMHQP7ycqmRTz99'

var cb = new Codebird;
cb.setConsumerKey(CONSUMER_KEY, CONSUMER_SECRET);

function login() {
  cb.__call(
    "oauth_requestToken",
    {oauth_callback: "oob"},
    function (reply,rate,err) {
        if (err) {
            console.log("error response or timeout exceeded" + err.error);
        }
        if (reply) {
            console.log(reply)
            // stores it
            cb.setToken(reply.oauth_token, reply.oauth_token_secret);

            // gets the authorize screen URL
            cb.__call(
                "oauth_authorize",
                {},
                function (auth_url) {
                    window.codebird_auth = window.open(auth_url);
                }
            );
        }
    }
);
}

function getHash(string){
    var hmac = crypto.createHmac('sha1', key);
    hmac.update(string);
    return hmac.digest('binary');
};

function getNonce() {
  return new Buffer(randomstring.generate(32)).toString('base64').split('=')[0];
}

function getSignature() {

}

function requestToken() {
  const URL = 'https://api.twitter.com/oauth/request_token'
  let Authorization = ``
  Authorization+=`OAuth oauth_callback="http%3A%2F%2Flocalhost%2Fsignin%2F",`
  const authorizationHeaders = {
    oauth_consumer_key: CONSUMER_KEY,
    oauth_nonce: getNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: parseInt(Date.now() / 1000),
    oauth_version: '1.0'
  }
  let keys = Object.keys(authorizationHeaders);
  let secret_key = '';
  keys.forEach((key, index) => {
    secret_key+=encodeURIComponent(key);
    secret_key+='='
    secret_key+=encodeURIComponent(authorizationHeaders[key]);
    if (index < keys.length - 1) {
      secret_key+='&'
    }
  })
  secret_key='POST&'+encodeURIComponent(URL)+'&'+secret_key
  console.log(secret_key);
  authorizationHeaders['oauth_signature'] = getHash(encodeURIComponent(secret_key));
  keys = Object.keys(authorizationHeaders);
  keys.forEach((key, index) => {
    Authorization+=`${key}="${authorizationHeaders[key]}"`
    if (index < keys.length - 1) {
      Authorization+=','
    }
  })
  let req = jQuery.ajax(URL, {
    method:'POST',
    headers: {
      Authorization
    }
  })
  console.dir(req);
}
