const config = {
  consumerKey: '9NjY4wu59Mz7PlAOUej6PFBlb',
  consumerSecret: 'Rp6ujmVuA9dhX47nuxvPUNXoWdTW4FtrZubiMHQP7ycqmRTz99',
};


const path = require('path');

const ROOT_MODULES = path.join(__dirname, '../../../../../')

const Twitter = require(ROOT_MODULES + 'twitter')
const localforage = require(ROOT_MODULES + 'localforage')
const jQuery = require(ROOT_MODULES + 'jquery')

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

function apiGetRequest(url) {
  return new Promise(function(resolve, reject) {
    client = client || window.client
    var params = {screen_name: 'nodejs'};
    client.get(url, params, function(error, body, response) {
      if (!error) {
        resolve(body);
      } else {
        console.error(error);
        reject(error)
      }
    });
  });
}

function renderTweets(tweets, refresh=true) {
  if (!tweets) return ;
  let section = jQuery('#feed');
  if (refresh) {
    section.html('');
  }
  tweets.forEach((tweet) => {
    // console.log(tweet);
    html=`
    <div class="content" id="${tweet.id}">
      <img src="${tweet.user.profile_image_url}" alt="content-user" class="user-pic">
      <h2>${tweet.user.name}</h2>
      <p>${tweet.text}</p>
      <div class="images">
        ${tweet.extended_entities ? tweet.extended_entities.media.map(media =>
          `<img src="${media.media_url}" alt="content-image" class="content-image">`
        ): '<img />'}
      </div>
    </div>
    `
    section.append(html);
  })
  localforage.setItem('tweets', tweets);
}

function renderProfile(account) {
  if(!account) return ;
  // console.log(account)
  jQuery('#profile-pic')[0].src = account.profile_image_url
  localforage.setItem('account', account)
}

function refreshTweets() {
  jQuery('#refresh').addClass('rotate');
  apiGetRequest('statuses/home_timeline')
  .then((tweets) => {
    jQuery('#refresh').removeClass('rotate');
    renderTweets(tweets);
  })
  .catch((error) => {
    jQuery('#refresh').removeClass('rotate');
  })
}

getClient()
.then(() => {
  refreshTweets();
  apiGetRequest('account/verify_credentials')
  .then(renderProfile)
})

localforage.getItem('tweets')
.then(renderTweets)
localforage.getItem('account')
.then(renderProfile)
