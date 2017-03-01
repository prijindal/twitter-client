const jQuery = require('jquery');
const auth0 = require('auth0-js');
const localforage = require('localforage');
const Twitter = require('twitter');

const CONSUMER_KEY = '9NjY4wu59Mz7PlAOUej6PFBlb';
const CONSUMER_SECRET = 'Rp6ujmVuA9dhX47nuxvPUNXoWdTW4FtrZubiMHQP7ycqmRTz99';
// const ACCESS_TOKEN_KEY = '333327323-6gUhSyzmF5DmFdL9AKS3ahx2w5ujCcnJNmxHHchT'
// const ACCESS_TOKEN_SECRET = 'zXLydS1Y9HClHSfdLi3mAFMBaSsRtg2hFH6T1XYoW4lVt'

const webAuth = new auth0.WebAuth({
  domain:       'prijindal.auth0.com',
  clientID:     'T6BXOW19RCYLa5QcNh6HkWWgiQ1oyX6m',
  responseType: 'token'
});


function login() {
  webAuth.popup.authorize({
    connection: 'twitter',
  }, (err, res) => {
    console.log(res)
    localforage.setItem('accessToken', res.accessToken);
    fetchUserDetails(res.accessToken);
  });
}

function fetchUserDetails(accessToken) {
  var client = new Twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    bearer_token: accessToken,
  });
  webAuth.client.userInfo(accessToken, (error, result) => {
    console.log(error, result)
  })
  var params = {screen_name: 'nodejs'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    console.error(error);
    if (!error) {
      console.log(tweets);
    }
  });

}

// localforage.getItem('accessToken')
// .then(accessToken => {
//   fetchUserDetails(accessToken);
// })
