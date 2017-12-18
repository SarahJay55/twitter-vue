var express    = require('express');
var Webtask    = require('webtask-tools');
var bodyParser = require('body-parser');
var OAuth      = require('oauth');
var axios      = require('axios');
var app        = express();

var twitterClientKey = "c8L2v4HQVZ18FMn9uYyUIrzbs";
var twitterClientSecret = "xmPcwRdrMrqbxyR7LB1p0OegPaZjghoDydMFCU7V141F1N6yCQ";

app.use(bodyParser.json());

var oauth2 = new OAuth.OAuth2(
  twitterClientKey,
  twitterClientSecret,
  'https://api.twitter.com/',
  null,
  'oauth2/token',
  null
  );

app.get('/', function (req, res) {
  const query = req.query.q;
  
  oauth2.getOAuthAccessToken('', {'grant_type': 'client_credentials'}, function (e, accessToken, refreshToken, results){
    axios.get(`https://api.twitter.com/1.1/search/tweets.json?q=${query}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      res.json({tweets: response.data.statuses});
    })
  })
});

module.exports = Webtask.fromExpress(app);
