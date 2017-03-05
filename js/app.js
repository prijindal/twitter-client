const path = require('path');
const fs = require('fs');
const Twitter = require('twitter')
const localforage = require('localforage')
const jQuery = require('jquery')
const mustache = require('mustache');
const {ipcRenderer} = require('electron')
const getOauth = require('../js/helpers/getOauth');
const config = require('../config').twitter;

const feed = fs.readFileSync(path.join(__dirname, '/partials/feed.html'), 'utf8')
const retweet = fs.readFileSync(path.join(__dirname, '/partials/retweet.html'), 'utf8')

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

function apiGetRequest(url, params) {
  return new Promise(function(resolve, reject) {
    client = client || window.client
    params = Object.assign({}, {screen_name: 'nodejs'}, params)
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

function renderProfile(account) {
  if(!account) return ;
  // console.log(account)
  jQuery('#profile-pic')[0].src = account.profile_image_url
  localforage.setItem('account', account)
}

const COUNT = 15;
let max_id;
let loading;

function mentionParser(mention, text) {
  let mentionString = text.substring(mention.indices[0], mention.indices[1])
  return { mentionString, mention };
}

function mentionTextReplacer({mentionString, mention}, text, url) {
  return text.replace(mentionString,
    `<a href="#"
        onclick="openUrl('${url}')">${mentionString}
      </a>`
    )
}

function getText(tweet) {
  const { entities } = tweet
  let { text } = tweet
  const { hashtags, symbols, urls, user_mentions } = entities;
  let mentionsReplacement = user_mentions.map(data => mentionParser(data, text));
  let urlsReplacement = urls.map(data => mentionParser(data, text));

  mentionsReplacement.forEach((data) => {text = mentionTextReplacer(data, text, `https://twitter.com/${data.mention.screen_name}`)});
  urlsReplacement.forEach((data) => {text = mentionTextReplacer(data, text, data.mention.expanded_url)});

  console.log(hashtags, symbols, urls)
  return text
}

function renderTweets(tweets, refresh=true) {
  if (!tweets) return ;
  let section = jQuery('#feed');
  if (refresh) {
    section.html('');
  }
  tweets.forEach((tweet) => {
    let html;
    if (tweet.retweeted_status) {
      let feedHTML = mustache.render(feed, { tweet: tweet.retweeted_status }, { text:getText(tweet.retweeted_status) });
      html = mustache.render(retweet, { tweet } ,{ feed: feedHTML })
    } else {
      html = mustache.render(feed, { tweet },{ text: getText(tweet) });
    }
    section.append(html);
  })
  if (!refresh) {
    localforage.getItem('tweets')
    .then((oldTweets) => {
      localforage.setItem('tweets', [
        ...oldTweets,
        ...tweets,
      ])
    })
  } else {
    localforage.setItem('tweets', tweets);
  }
  max_id = tweets[tweets.length - 1].id
}

function refreshTweets() {
  loading = true;
  jQuery('#loading-bar').removeClass('hidden')
  apiGetRequest('statuses/home_timeline', { count: COUNT })
  .then((tweets) => {
    renderTweets(tweets, true);
    loading = false;
    jQuery('#loading-bar').addClass('hidden')
  })
}

function loadNew() {
  loading = true;
  jQuery('#loading-bar').removeClass('hidden')
  apiGetRequest('statuses/home_timeline', { count: COUNT, max_id  })
  .then((tweets) => {
    renderTweets(tweets, false);
    jQuery('#loading-bar').addClass('hidden')
    loading = false;
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

function initScroll() {
  const documentEl = jQuery(document)
  documentEl.on('scroll', () => {
    let scrollTop = documentEl.scrollTop()
    let height = documentEl.height();
    if(height - scrollTop < 1000) {
      if (!loading) {
        loadNew();
      }
    }
  });
}

function openUrl(url) {
  window.open(url, url)
}

initScroll();
