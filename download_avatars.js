var request = require('request');
var secrets = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, handleFetchAvatarUrl) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };


  request(options, function (err, res, body) {

    var contributors = JSON.parse(res.body);
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


getRepoContributors("jquery", "jquery", fetchAvatarUrl);
downloadImageByURL('https://avatars3.githubusercontent.com/u/156867?v=4', 'avatars/Monica.jpg')