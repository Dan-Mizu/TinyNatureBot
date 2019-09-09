// imports
var readline = require('readline');
var Twit = require('twit');
var dateFormat = require('dateformat');
var weighted = require('weighted')
var config = require('./config');
//var T = new Twit(config); //@tinynaturebot config file (my twitter bot's account keys are in this file. use yours when replicating. i provide the config-default.js file to fill in.)
var T = new Twit(config-test); // test config (when i want to test my bot without using the main twitter account)

//
// tinynaturebot - creative project by danny baghdadi
// v.1.2 - *scene has been enlarged, due to twitter limit increasing. now 7x7. (might revert, or change dependant on reception.) *animals added to the scenes *a ton more habitats added *randomability of emojis are weighted now. *more rare events added// v0.4 twitter bot that tweets out tiny bits of nature every hour *scene influenced by time, weather, and habitat. *scene size is 7x4 *rare habitats and events included. 
// (i tried to make this as annotated as possible. i am a bud in bot programming but i am slowly growing and still want to share a lot of my projects openly so that others can replicate it. made with NodeJS.)
//

// global variables
var loopN = 1;
var time = [ 'day', 'night' ]
var weather = [ 'clear', 'cloudy', 'rain', 'thunder', 'snow' ]
var habitat = [ 'forest', 'prairie', 'savannah', 'tundra', 'meadow', 'soil', 'beach', 'desert', 'ocean' ]

/* planned feature, so i'm commenting it for now.
	// holiday detection
var holiday = 'default'; //'default' means there's no holiday, so proceed as normal.
if (new Date().getMonth() == 4) {
	holiday = 'pride';
}
*/

// emoji arrays
let eAir = '     ';
let eRare = ['☄️', '🍀'];

let eMoon = {'🌑':1, '🌘':3, '🌗':3, '🌖':3, '🌕':1, '🌔':3, '🌓':3, '🌒':3};
let eSkyNight = {'⭐':5, '✨':1};
let eSkyDay = ['☀', '🌤', '⛅', '🌦️', '☁', '⛈️', '🌧️', '🌨️', '❄️'];

let eTree = ['🌳', '🌲', '🌱', '🌴', '🌵', '🌊'];
let eGround = ['🌿', '🌾', '☘️', '🍂', '🍃', '🍄'];
let eFlower = ['🌷', '🌹', '🌼', '🌸', '🌺', '🌻'];

let eAnimal = [
	['🦉', '🐿️', '🐇', '🦋', '🐛', '🐝', '🐞', '🦗'] //forest
	['🐂', '🐏', '🐑', '🐐', '🐄', '🐖', '🐓', '🦃'] //prairie
	['🐅', '🐆', '🐘', '🐃', '🦓', '🦒'] //savannah
    ['⛄'] //tundra
	['🐛', '🐝', '🐞', '🦗', '🐌'] //meadow
	['🐌', '🐛', '🐝', '🐞', '🦗', '🐜', '🕷️'] //soil
	['🦀', '🐚', '🐢'] //beach
	['🐊', '🦎', '🐍', '🦂', '🐫'] //desert
	['🐋', '🐬', '🦈', '🐙', '🦑', '🐡', '🐟', '🐠', '🦐'] //ocean
] //called like: eAnimal[0][1] which is the squirrel, or [3][0] which is the snowman.

// random integer generator - (makes random numbers between the specified 'min' and 'max' numbers)
function getRandomInt(min, max) {
    min -= 1;
    max -= 1;
    return Math.floor(Math.random() * (max - min + 1)) + min; // the + 1 offsets it so i can just call it like array[getRandomInt(1, array.length)]. i use a 1 instead of 0. pet peeve of mine sry. 
}

// generates a nature scene for the tweet - (sets the time, weather, and habitat. generated randomly with weights on certain emojis to create rarer events.)
function createNature() {
    //resets default tweet scene. size is 7x7.
    var tweetScene = [
        'celestialbody', 'air', 'air', 'air', 'air', 'air', 'air',
        'air', 'air', 'air', 'air', 'air', 'air', 'air',
        'air', 'air', 'air', 'air', 'air', 'air', 'air',
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground',
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground',
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground',
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'
    ];

    //determines time, weather, and habitat randomly
    time = time[getRandomInt(1, time.length)];
    weather = weather[getRandomInt(1, weather.length)];
    habitat = habitat[getRandomInt(1, habitat.length)];

    //begin tweet scene replacement
        //time + weather
    if (time == 'day') { 
        if (weather == 'clear') {
            //changes the 'celestialbody' slot in tweetScene[]
            tweetScene[0] = eSkyDay[0]; //clear sun
        } else if (weather = 'cloudy') {
            //changes the 'celestialbody' slot in tweetScene[]
            switch (new getRandomInt(1,2)) {
                case 1: //sun
                    tweetScene[0] = eSkyDay[getRandomInt(2,3)]; //both rainy sun clouds
                    break;
                case 2: //no sun
                    tweetScene[0] = eSkyDay[4]; //cloud
            }
        } else if (weather == 'rain') {
            //changes the 'celestialbody' slot in tweetScene[]
            switch (new getRandomInt(1,2)) {
                case 1: //sun
                    tweetScene[0] = eSkyDay[3]; //rainy sun
                    break;
                case 2: //no sun
                    tweetScene[0] = eSkyDay[6]; //rain cloud
            }
        } else if (weather == 'thunder') {
            //changes the 'celestialbody' slot in tweetScene[]
            tweetScene[0] = eSkyDay[getRandomInt(6,7)]; //thunder or rain cloud
        } else if (weather == 'snow') {
            //changes the 'celestialbody' slot in tweetScene[]
            switch (new getRandomInt(1,2)) {
                case 1: //sun
                    tweetScene[0] = eSkyDay[2];
                    break;
                case 2: //no sun
                    tweetScene[0] = eSkyDay[7];
            }
        }
    } else if (time == 'night') {
        var moonPhase = getRandomInt(1, eMoon.length); //sets the moonphase if time has been determined as 'night'
        

    }
        //habitat
}

// log pusher - (pushes what has been created in createNature() to my log for testing and uh... (logging purposes))
function pushLog() {
    var now = new Date();
    console.log (
        '....................' + '\n' +
        '>loop number: ' + loopN + '\n' +
        '>timestamp: ' + dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT") + '\n' +
        '====================' + '\n' +
        '-time of day: ' + time
        );
    if (time == 'night')
		console.log('-moon phase: ' + eMoon[moonPhase] + ' (' + (moonPhase + 1) + ')');
    console.log(
        '\n-weather: ' + weather + '\n' +
        '\n-habitat: ' + habitat + '\n' +
        '====================' + '\n' +
        '....................' + '\n'
        );
}

// loop starter - (starts the loop to start tweeting every 'loopTime' amount of minutes (set to 4 hours as of now))
function startLoop(loopTime) {
    createNature();
    var bufferTime = loopTime;
    var bufferAmount = 0;
    process.stdout.write('Loop Timer: ' + bufferTime); //process.stdout.write is used so that the timer counts down without making a new line
    var countdownTimer = setInterval(function () {
        readline.cursorTo(process.stdout, 0);
        bufferTime -= 1;
        process.stdout.write('Loop Timer: ' + bufferTime);
        bufferAmount += 1;

        if (bufferTime <= 0) {
            clearInterval(countdownTimer);
            readline.clearLine(process.stdout);
            readline.cursorTo(process.stdout, 0);
            console.log('Buffer Time: ' + bufferAmount + '\n\n\n'); //prints out how much time was buffered between the loop (logging purposes)
            loopN += 1;
            pushLog(); //this function pushes information about the current scene to the log every loop
            startLoop(loopTime); //starts the loop over again (once bufferTime has run out)
        }
    }, 1000);
}

// main
console.log ( //(logging purposes)
    '********** tinynaturebot v1.2 **********\n' +
    '                  init                  \n'
);
startLoop(240); //begins the loop (believe it or not, this is the first thing in my entire script that 'runs'. it starts the infinite loop that continues to tweet on a NodeJS server. the number in startLoop() is fed into the startLoop() function above, and that loop uses the createNature() function to create the randomized scene. The chain gets more complicated as you dig into the functions, but as you wrap your head around it, the chain starts to make more sense as you realize each of the fucntions' purpose.)