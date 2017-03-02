const localforage = require('localforage');
const {ipcRenderer} = require('electron')

function login() {
  A = window.open('http://127.0.0.1:3000/auth/twitter', 'authWindow', 'height=600, width=480')
}

window.addEventListener("message", parseConfig, false);

function parseConfig(event) {
  const { oauthToken, oauthSecret } = event.data;
  console.log(oauthToken, oauthSecret);
  localforage.setItem('oauthToken', oauthToken)
  .then(() => {
    localforage.setItem('oauthSecret', oauthSecret)
    .then(() => {
      window.location.pathname = __dirname + '/app.html'
      ipcRenderer.send('end:express')
    })
  })
}
