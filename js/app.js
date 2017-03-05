const path = require('path');
const Twitter = require('twitter')
const localforage = require('localforage')
const jQuery = require('jquery')
const mustache = require('mustache');
const {ipcRenderer} = require('electron')
const getOauth = require('../js/helpers/getOauth');
const config = require('../config').twitter;

// const feed = require('./partials/feed.html');

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
    let html = mustache.render(`<div class="content" id="{{tweet.id}}">
      <img src="{{tweet.user.profile_image_url}}" alt="content-user" class="user-pic">
      <h2>{{tweet.user.name}}</h2>
      <p>{{tweet.text}}</p>
      <div class="images">
        <img src="{{tweet.extended_entities.media[0].media_url}}" alt="content-image" class="content-image">
      </div>
    </div>
`, { tweet });
    console.log(html)
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

function logout() {
  localforage.clear()
  .then(() => {
    ipcRenderer.send('logout');
    window.location.pathname = __dirname + '/index.html'
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
