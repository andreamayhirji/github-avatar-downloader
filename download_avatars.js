var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

var repoOwner = process.argv[2];
var repoName = process.argv[3];

function getRepoContributors(repoOwner, repoName, handleFetchAvatarUrl) {
  if (!(repoOwner && repoName)) {
    console.warn("You should enter your username and a repo name.")
    return;
  } 


  // console.log('repoOwner: ', repoOwner);
  // console.log('repoName', repoName);

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };


  request(options, function (err, res, body) {
    // console.log(res.statusCode); // 404 if missing; 200 (probably?) if present
    // console.log(body); // body.message === 'Not Found' if not found; Probably not that if found.
 
    var contributors = JSON.parse(body);
    contributors.forEach((contributor) => {
      handleFetchAvatarUrl(contributors)

    });
  });

}

function downloadImageByURL(url, filePath) {
  var fetchFilePath = request.get(url).pipe(fs.createWriteStream(filePath));
  return fetchFilePath;
}

var fetchAvatarUrl = function (contributors) {
  contributors.forEach(function (element) {
    var avatarLogin = 'avatars/' + element.login + '.jpg'
    downloadImageByURL(element.avatar_url, avatarLogin);
  });
}


getRepoContributors(repoOwner, repoName, fetchAvatarUrl);
