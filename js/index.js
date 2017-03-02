getOauth()
.then(({ oauthToken, oauthSecret }) => {
  if (oauthToken && oauthSecret) {
    window.location.pathname = '/app';
  } else {
    window.location.pathname = '/login';
  }
});
