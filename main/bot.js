//Imports
var readline = require('readline');
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

//Main
console.log('**\nNature Bot Init\n**\n');

var intRandom;
var loop;

var weather; //Clear, Rain, Thunder, Snow

var eAir = '     ';
var eSun = '☀';
var eSunCloudSmall = '🌤';
var eSunCloudBig = '⛅';
var eCloud = '☁'; 
var ePineTree = '🌲';

var tweetScene =
    [
        'air', 'air', 'air', 'air', 'air', 'air', 'air', "\n",
        'air', 'air', 'air', 'air', 'air', 'air', 'air', "\n",
        'air', 'air', 'air', 'air', 'air', 'air', 'air', "\n",
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground', "\n",
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'
    ]
//Math.floor(Math.random() * (max - min + 1) + min);

function getRandomInt(min, max) {
    intRandom = Math.floor(Math.random() * (max - min + 1)) + min;
}
    //Set Clouds
getRandomInt(0, 3);
var cloudAmt = intRandom;
loop = 0;
while (loop <= cloudAmt) {
    getRandomInt(7, 13);
    tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eCloud);
    loop += 1;
}

    //Set Sun
getRandomInt(0, 6);
if (cloudAmt == 2) {
    tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSunCloudSmall);
} else if (cloudAmt == 3) {
    tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSunCloudBig);
} else {
    tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSun);
}

tweetScene = String(tweetScene);

    //Set Forest
tweetScene = tweetScene.replace(/ground/g, ePineTree);

    //Set Air
tweetScene = tweetScene.replace(/air/g, eAir);

    //Tweet Command
T.post('statuses/update', { status: tweetScene.replace(/,/g, '') }, tweetInfo);

    //Success/Error
function tweetInfo(err, data, response) {
    if (err) {
        console.log('>Error Tweeting.\n');
    } else {
        console.log('>Successfully Tweeted:\n' + tweetScene.replace(/,/g, ''));
    }
}