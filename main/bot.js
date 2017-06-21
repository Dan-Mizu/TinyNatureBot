// Imports
var readline = require('readline');
var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);

// Main
console.log('**\nTiny Nature Bot Init\n**\n');

var intRandom;
var loop;
var tweetScene;

function getRandomInt(min, max) {
     return Math.floor(Math.random() * (max - min + 1)) + min;
}

var time; //Day, Night
var weather; //Clear 50%, Rain 25%, Thunder 5%, Snow 20%
var habitat; //Oak 55%, Pine 30%, Palm 10%, Sunflower 1%, Blossom 1%, Flower 3%

//
var eAir = '     ';

var eSun = '☀';
var eSunCloudSmall = '🌤';
var eSunCloudBig = '⛅';

var eMoon = ['🌑', '🌘', '🌗', '🌖', '🌒', '🌓', '🌔', '🌕']
var eStar = '⭐'; // 70%
var eSparkle = '✨'; // 25%
var eCommet = '☄️'; // 5%

var eCloud = '☁'; //Clear
var eSunCloudRain = '🌦️'; //Rain
var eCloudRain = '🌧️'; //Rain
var eCloudThunder = '⛈️'; //Thunder
var eCloudSnow = '🌨️'; //Snow

var eOakTree = '🌳';
var ePineTree = '🌲';
var ePalmTree = '🌴';
var eShell = '🐚';
var eCrab = '🦀';
var eSapling = '🌱';
var eFern = '🌿';
var eTulip = '🌷'; //Flower
var eRose = '🌹'; //Flower
var eBlossom = '🌼'; //Blossom
var eCherryBlossom = '🌸'; //Blossom
var eHibiscus = '🌺'; //Blossom
var eSunflower = '🌻'; //SunFlower
//

tweetNature();
function tweetNature() {

    console.log('__\n >New Nature Tweet\n');

    // Set Time of Day
    if (getRandomInt(0, 1) == 0) {
        time = 'Day';
    } else {
        time = 'Night';
    }

    // Set Moon Phase
    if (time == 'Night') {
        var moonPhase = getRandomInt(0, 7);
    }

    console.log('-Time of Day: ' + time);
    if (time == 'Night') {
        console.log('-Moon Phase: ' + eMoon[moonPhase] + "( ${moonPhase} )");
    }

    // Set Weather
    if (time == 'Day') {
        intRandom = getRandomInt(0, 99);
        if (intRandom >= 95) {
            weather = 'Thunder';
        } else if (intRandom >= 74) {
            weather = 'Snow';
        } else if (intRandom >= 50) {
            weather = 'Rain';
        } else if (intRandom >= 0) {
            weather = 'Clear';
        }
    } else {
        weather = 'Clear';
    }

    console.log('\n-Weather: ' + weather);

    // Set Habitat
    intRandom = getRandomInt(0, 99);
    if (intRandom == 99) {
        habitat = 'Sunflower';
    } else if (intRandom >= 98) {
        habitat = 'Blossom';
    } else if (intRandom >= 94) {
        habitat = 'Flower';
    } else if (intRandom >= 84) {
        habitat = 'Palm';
    } else if (intRandom >= 54) {
        habitat = 'Pine';
    } else if (intRandom >= 0) {
        habitat = 'Oak';
    }

    console.log('\n-Habitat: ' + habitat);

    tweetScene =
        [
            'air', 'air', 'air', 'air', 'air', 'air', 'air',
            'air', 'air', 'air', 'air', 'air', 'air', 'air',
            'air', 'air', 'air', 'air', 'air', 'air', 'air',
            'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground',
            'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'
        ]

    // Place Clouds/Stars
    var cloudAmt;
    if (time == 'Day') {
        if (weather == 'Clear') {
            cloudAmt = getRandomInt(0, 3);
            loop = 0;
            while (loop <= cloudAmt) {
                intRandom = getRandomInt(0, 13);
                if (tweetScene[intRandom] == 'air') {
                    tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eCloud);
                    loop += 1;
                }
            }
        } else if (weather == 'Rain') {
            cloudAmt = getRandomInt(0, 5);
            loop = 0;
            while (loop <= cloudAmt) {
                intRandom = getRandomInt(0, 13);
                if (tweetScene[intRandom] == 'air') {
                    tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eCloudRain);
                    loop += 1;
                }
            }
        } else if (weather == 'Thunder') {
            cloudAmt = getRandomInt(0, 5);
            loop = 0;
            while (loop <= cloudAmt) {
                intRandom = getRandomInt(0, 13);
                if (tweetScene[intRandom] == 'air') {
                    tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eCloudThunder);
                    loop += 1;
                }
            }
        } else if (weather == 'Snow') {
            cloudAmt = getRandomInt(0, 6);
            loop = 0;
            while (loop <= cloudAmt) {
                intRandom = getRandomInt(0, 13);
                if (tweetScene[intRandom] == 'air') {
                    tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eCloudSnow);
                    loop += 1;
                }
            }
        } else {
            throw new Error("Incorrect Weather value");
        }
    } else if (time == 'Night') {
        var starAmt = getRandomInt(0, 3);
        loop = 0;
        while (loop <= starAmt) {
            getRandomInt(0, 99);
            if (intRandom >= 95) {
                intRandom = getRandomInt(0, 13);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eCommet);
            } else if (intRandom >= 74) {
                intRandom = getRandomInt(0, 13);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSparkle);
            } else if (intRandom >= 0) {
                intRandom = getRandomInt(0, 13);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eStar);
            }
            loop += 1;
        }
    } else {
        throw new Error("Incorrect Time value");
    }

    // Place Sun/Moon
    if (time == 'Day') {
        if (weather == 'Clear') {
            intRandom = getRandomInt(0, 6);
            if (cloudAmt == 2) {
                tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSunCloudSmall);
            } else if (cloudAmt == 3) {
                tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSunCloudBig);
            } else {
                tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSun);
            }
        } else if (weather == 'Snow') {
            intRandom = getRandomInt(0, 6);
            tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSunCloudBig);
        } else {
            intRandom = getRandomInt(0, 6);
            tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eSunCloudRain);
        }
    } else if (time == 'Night') {
        intRandom = getRandomInt(0, 6);
        tweetScene[intRandom] = tweetScene[intRandom].replace(/air/g, eMoon[moonPhase]);
    }

    // Set Plants/Beach
    if (habitat == 'Oak' || habitat == 'Pine') {
        var plantAmt = getRandomInt(0, 3);
        loop = 0;
        while (loop <= plantAmt) {
            intRandom = getRandomInt(0, 99);
            if (intRandom >= 60) {
                intRandom = getRandomInt(21, 34);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/ground/g, eSapling);
            } else if (intRandom >= 0) {
                intRandom = getRandomInt(21, 34);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/ground/g, eFern);
            }
            loop += 1;
        }
    } else if (habitat == 'Palm') {
        var palmAmt = getRandomInt(0, 9);
        loop = 0;
        while (loop <= palmAmt) {
            intRandom = getRandomInt(21, 34);
            tweetScene[intRandom] = tweetScene[intRandom].replace(/ground/g, ePalmTree);
            loop += 1;
        }
        var beachAmt = getRandomInt(0, 2);
        loop = 0;
        while (loop <= beachAmt) {
            intRandom = getRandomInt(0, 99);
            if (intRandom >= 80) {
                intRandom = getRandomInt(21, 34);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/ground/g, eCrab);
            } else if (intRandom >= 0) {
                intRandom = getRandomInt(21, 34);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/ground/g, eShell);
            }
            loop += 1;
        }
    } else if (habitat == 'Flower') {
        var flowerAmt = getRandomInt(0, 9);
        loop = 0;
        while (loop <= flowerAmt) {
            intRandom = getRandomInt(21, 34);
            tweetScene[intRandom] = tweetScene[intRandom].replace(/ground/g, eRose);
            loop += 1;
        }
    } else if (habitat == 'Blossom') {
        var blossomAmt = getRandomInt(0, 9);
        loop = 0;
        while (loop <= blossomAmt) {
            intRandom = getRandomInt(0, 99);
            if (intRandom >= 80) {
                intRandom = getRandomInt(21, 34);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/ground/g, eHibiscus);
            } else if (intRandom >= 0) {
                intRandom = getRandomInt(21, 34);
                tweetScene[intRandom] = tweetScene[intRandom].replace(/ground/g, eCherryBlossom);
            }
            loop += 1;
        }
    }

    // Set Empty Space
    tweetScene.splice(7, 0, "\n");
    tweetScene.splice(15, 0, "\n");
    tweetScene.splice(23, 0, "\n");
    tweetScene.splice(31, 0, "\n");
    tweetScene = String(tweetScene);
    if (habitat == 'Oak') {
        tweetScene = tweetScene.replace(/ground/g, eOakTree);
    } else if (habitat == 'Pine') {
        tweetScene = tweetScene.replace(/ground/g, ePineTree);
    } else if (habitat == 'Palm') {
        tweetScene = tweetScene.replace(/ground/g, eAir);
    } else if (habitat == 'Flower') {
        tweetScene = tweetScene.replace(/ground/g, eTulip);
    } else if (habitat == 'Blossom') {
        tweetScene = tweetScene.replace(/ground/g, eBlossom);
    } else if (habitat == 'Sunflower') {
        tweetScene = tweetScene.replace(/ground/g, eSunflower);
    }
    tweetScene = tweetScene.replace(/air/g, eAir);

    // Tweet Command
    T.post('statuses/update', { status: tweetScene.replace(/,/g, '') }, tweetInfo);
}

    // Success/Error
function tweetInfo(err, data, response) {
    if (err) {
        console.log('\n >Error Tweeting.\n');
    } else {
        console.log('\n >Successfully Tweeted:\n' + tweetScene.replace(/,/g, '') + '\n__\n');
        startTimer();
    }
}

    // Timer
function startTimer() {
    var bufferSeconds = 60 * 30;
    var bufferAmount = 0;
    var countdownTimer = setInterval(function () {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write('Loop Timer: ' + bufferSeconds);
        bufferSeconds = bufferSeconds - 1;
        bufferAmount += 1;

        if (bufferSeconds <= 0) {
            clearInterval(countdownTimer);
            readline.clearLine(process.stdout);
            readline.cursorTo(process.stdout, 0);
            console.log('Buffer Time: ' + bufferAmount);
            tweetNature();
        }
    }, 1000);
}