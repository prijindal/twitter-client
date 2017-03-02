const getOauth = require('../js/helpers/getOauth');
const {ipcRenderer} = require('electron')

getOauth()
.then(({ oauthToken, oauthSecret }) => {
  if (oauthToken && oauthSecret) {
    window.location.pathname = __dirname + '/app.html'
  } else {
    window.location.pathname = __dirname + '/login.html'
    ipcRenderer.send('start:express')
  }
});
