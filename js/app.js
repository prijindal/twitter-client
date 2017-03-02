const config = {
  consumerKey: '9NjY4wu59Mz7PlAOUej6PFBlb',
  consumerSecret: 'Rp6ujmVuA9dhX47nuxvPUNXoWdTW4FtrZubiMHQP7ycqmRTz99',
};


const path = require('path');

const ROOT_MODULES = path.join(__dirname, '../../../../../')

const Twitter = require(ROOT_MODULES + 'twitter')

function getClient() {
  return new Promise(function(resolve, reject) {
    if (window.client) {
      return resolve(window.client);
    }
    getOauth()
    .then(({ oauthToken, oauthSecret }) => {
      if (!oauthToken || !oauthSecret) {
        window.location.pathname = '/'
      }
      const client = new Twitter({
        consumer_key: config.consumerKey,
        consumer_secret: config.consumerSecret,
        access_token_key: oauthToken,
        access_token_secret: oauthSecret
      });
      window.client = client;
      return resolve(client)
    })
  });
}

function getTweets() {
  client = client || window.client
  var params = {screen_name: 'nodejs'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets);
    }
  });
}

getClient()
.then(() => {
  getTweets()
})
