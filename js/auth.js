function login() {
  localforage.setItem('oauthToken', oauthToken)
  .then(() => {
    localforage.setItem('oauthSecret', oauthSecret)
    .then(() => {
      window.location.pathname = '/app';
    })
  })
}

login();
