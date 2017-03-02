function getOauth() {
  return new Promise(function(resolve, reject) {
    localforage.ready()
    .then(() => {
      localforage.getItem('oauthToken')
      .then((oauthToken) => {
        localforage.getItem('oauthSecret')
        .then((oauthSecret) => {
          return resolve({ oauthToken, oauthSecret });
        })
      })
    })
  });
}
