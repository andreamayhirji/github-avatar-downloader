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

//this is an Asynchronous function. This is why it includes a callback.
// when you complete this network request (could take 10 sec), call the callback and run the code inside it.
    request(options, function(err, res, body) {
    //res.body -- this is strandard for finding the body.
    //JSON.parse is going to take the res.body and convert it to an array.
    var contributors = JSON.parse(res.body);
    // console.log('this is the response ', res.body)
    contributors.forEach((contributor) => {
        handleFetchAvatarUrl(contributor.avatar_url)
        // console.log(contributor);
    });
  });

}

function downloadImageByURL(url, filePath) {

  request.get(url)               
       .on('error', function (err) {                                  
         throw err; 
       })
       .pipe(fs.createWriteStream(filePath)); 


}

var fetchAvatarUrl = function(avatarUrl) {
  console.log(avatarUrl);
}


// getRepoContributors("jquery", "jquery", fetchAvatarUrl);
downloadImageByURL('https://avatars2.githubusercontent.com/u/2741?v=3&s=466', 'avatars/kvirani.jpg')