// imports
const readline = require('readline');
const Twit = require('twit');
const dateFormat = require('dateformat');
const weighted = require('weighted')
//var config = require('./config');
//var T = new Twit(config); //@tinynaturebot config file (my twitter bot's account keys are in this file. use yours when replicating. i provide the config-default.js file to fill in.)
const config = require('./config');
var T = new Twit(config); // test config (when i want to test my bot without using the main twitter account)

//
// tinynaturebot - creative project by danny baghdadi
// v.1.2 - *scene has been enlarged, due to twitter limit increasing. now 7x7. (might revert, or change dependant on reception.) *animals added to the scenes *a ton more habitats added *randomability of emojis are weighted now. *more rare events added// v0.4 twitter bot that tweets out tiny bits of nature every hour *scene influenced by time, weather, and habitat. *scene size is 7x4 *rare habitats and events included. 
// (i tried to make this as annotated as possible. i am a bud in bot programming but i am slowly growing and still want to share a lot of my projects openly so that others can replicate it. made with NodeJS.)
//

// global variables
var loopN = 1;
var tweetScene = [];
var time = [];
var moonPhase = 0;
var weather = [];
var habitat = [];

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

let eMoon = ['🌑', '🌘', '🌗', '🌖', '🌕', '🌔', '🌓', '🌒'];
let eSkyNight = ['⭐', '✨'];
let eSkyDay = ['☀', '🌤', '⛅', '🌦️', '☁', '⛈️', '🌧️', '🌨️', '❄️'];

let eTree = ['🌳', '🌲', '🌱', '🌴', '🌵', '🌊'];
let eGround = ['🌿', '🌾', '☘️', '🍂', '🍃', '🍄'];
let eFlower = ['🌷', '🌹', '🌼', '🌸', '🌺', '🌻'];

var eAnimal = [
	['🦉', '🐿️', '🐇', '🦋', '🐛', '🐝', '🐞', '🦗'], //forest
	['🐂', '🐏', '🐑', '🐐', '🐄', '🐖', '🐓', '🦃'], //prairie
	['🐅', '🐆', '🐘', '🐃', '🦓', '🦒'], //savannah
    ['⛄'], //tundra
	['🐛', '🐝', '🐞', '🦗', '🐌'], //meadow
	['🐌', '🐛', '🐝', '🐞', '🦗', '🐜', '🕷️'], //soil
	['🦀', '🐚', '🐢'], //beach
	['🐊', '🦎', '🐍', '🦂', '🐫'], //desert
	['🐋', '🐬', '🦈', '🐙', '🦑', '🐡', '🐟', '🐠', '🦐'] //ocean
] //called like: eAnimal[0][1] which is the squirrel, or [3][0] which is the snowman.

// reset scene - (resets the 'tweetScene' and other arrays to set up for a new tweet)
function resetScene() {
    tweetScene = [
        'celestialbody', 'air', 'air', 'air', 'air', 'air', 'air',
        'air', 'air', 'air', 'air', 'air', 'air', 'air',
        'air', 'air', 'air', 'air', 'air', 'air', 'air',
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground',
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground',
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground',
        'ground', 'ground', 'ground', 'ground', 'ground', 'ground', 'ground'
    ];
    time = [ 'day', 'night' ];
    weather = [ 'clear', 'cloudy', 'rain', 'thunder', 'snow' ];
    habitat = [ 'forest', 'prairie', 'savannah', 'tundra', 'meadow', 'soil', 'beach', 'desert', 'ocean' ];
        //'0', '1', '2', '3', '4', '5, '6',
        //'7', '8', '9', '10', '11', '12', '13',
        //'14', '15', '16', '17', '18', '19', '20',
        //'21', '22', '23', '24', '25', '26', '27',
        //'28', '29', '30', '31', '32', '33', '34',
        //'35', '36', '37', '38', '39', '40', '41',
        //'42', '43', '44', '45', '46', '47', '48'
}

// random integer generator - (makes random numbers between the specified 'min' and 'max' numbers)
function getRandomInt(min, max) {
    min -= 1;
    max -= 1;
    return Math.floor(Math.random() * (max - min + 1)) + min; // the + 1 offsets it so i can just call it like array[getRandomInt(1, array.length)]. i use a 1 instead of 0. pet peeve of mine sry. 
}

// empty slot finder - (finds an empty 'air' slot in the 'tweetScene' array)
function getEmptySlot(min, max) {
    var slot;
    while (slot != 'air') {
        var slotNum = getRandomInt(min, max); //randomly generated slot number for this loop
        slot = tweetScene[slotNum]; //sets 'slot' to whatever is in that 'tweetScene' slot. we're looking for 'air'
        if (slot == 'air')
            break;
    }
    return slotNum;
}

// generates a nature scene for the tweet - (sets the time, weather, and habitat. generated randomly with weights on certain emojis to create rarer events.)
function createNature() {
    //resets default tweet scene. size is 7x7.
    resetScene();

    //determines time, weather, and habitat randomly
    time = time[getRandomInt(1, time.length)];
    weather = weather[getRandomInt(1, weather.length)];
    habitat = habitat[getRandomInt(1, habitat.length)];

    //begin tweet scene replacement
        //time + weather
    if (time == 'day') { 
            //clear weather
        if (weather == 'clear') {
            //changes the 'celestialbody' slot in tweetScene[]
            tweetScene[0] = eSkyDay[0]; //clear sun
            //replaces 'air' spaces
            for (i = getRandomInt(1, 3); i > 0; i--) {
                //replace (1-3) of the 'air' spaces with a cloud
                tweetScene[getEmptySlot(1, 21)] = eSkyDay[4]; //cloud
            }

            //cloudy weather
        } else if (weather = 'cloudy') {
            //changes the 'celestialbody' slot in tweetScene[]
            switch (new getRandomInt(1,2)) {
                case 1: //sun
                    tweetScene[0] = eSkyDay[getRandomInt(2,3)]; //both sunny clouds
                    break;
                case 2: //no sun
                    tweetScene[0] = eSkyDay[4]; //cloud
            }
            //replaces 'air' spaces
            for (i = getRandomInt(3, 5); i > 0; i--) {
                //replace (3-5) of the 'air' spaces with a cloud
                tweetScene[getEmptySlot(1, 21)] = eSkyDay[4]; //cloud
            }

            //rainy weather
        } else if (weather == 'rain') {
            //changes the 'celestialbody' slot in tweetScene[]
            switch (new getRandomInt(1,2)) {
                case 1: //sun
                    tweetScene[0] = eSkyDay[3]; //rainy sun
                    break;
                case 2: //no sun
                    tweetScene[0] = eSkyDay[6]; //rain cloud
            }
            //replaces 'air' spaces
            for (i = getRandomInt(3, 6); i > 0; i--) {
                //replace (3-6) of the 'air' spaces with rain clouds
                tweetScene[getEmptySlot(1, 21)] = eSkyDay[6]; //rain cloud
            }

            //thunder weather
        } else if (weather == 'thunder') {
            //changes the 'celestialbody' slot in tweetScene[]
            tweetScene[0] = eSkyDay[getRandomInt(6,7)]; //thunder or rain cloud
            //replaces 'air' spaces
            for (i = getRandomInt(2, 4); i > 0; i--) {
                //replace (2-4) of the 'air' spaces with thunder clouds
                tweetScene[getEmptySlot(1, 21)] = eSkyDay[5]; //thunder cloud
            }
            for (i = getRandomInt(1, 3); i > 0; i--) {
                //replace (1-3) of the 'air' spaces with rain clouds
                tweetScene[getEmptySlot(1, 21)] = eSkyDay[6]; //rain cloud
            }

            //snowy weather
        } else if (weather == 'snow') {
            //changes the 'celestialbody' slot in tweetScene[]
            switch (new getRandomInt(1,2)) {
                case 1: //sun
                    tweetScene[0] = eSkyDay[2];
                    break;
                case 2: //no sun
                    tweetScene[0] = eSkyDay[7];
            }
            //replaces 'air' spaces
            for (i = getRandomInt(2, 4); i > 0; i--) {
                //replace (2-4) of the 'air' spaces with snow clouds
                tweetScene[getEmptySlot(1, 21)] = eSkyDay[7]; //snow cloud
            }
            for (i = getRandomInt(1, 2); i > 0; i--) {
                //replace (1-2) of the 'air' spaces with snowflakes
                tweetScene[getEmptySlot(1, 21)] = eSkyDay[8]; //snowflake
            }
        }
    } else if (time == 'night') {
        moonPhase = getRandomInt(1, eMoon.length); //sets the moonphase if time has been determined as 'night'
        //changes the 'celestialbody' slot in tweetScene[]
        tweetScene[0] = eMoon[moonPhase] //different emojis representing phases of the moon 'eMoon', has it's phase chosen by 'moonPhase'
        //replaces 'air' spaces
        for (i = getRandomInt(2, 3); i > 0; i--) {
            //replace (2-4) of the 'air' spaces with stars
            tweetScene[getEmptySlot(1, 21)] = eSkyNight[0]; //star
        }
        for (i = getRandomInt(1, 2); i > 0; i--) {
            //replace (1-3) of the 'air' spaces with twinkles
            tweetScene[getEmptySlot(1, 21)] = eSkyNight[1]; //twinkle
        }
    }

    //replace unused 'tweetScene' 'air' slots with actual spaces
    for (i = 21; i > 0; i--) {
        if (tweetScene[i] == 'air')
            tweetScene[i] = eAir;
    }

        //habitat
}

// pushes 'tweetScene' as a tweet to twitter account referenced in config. - ('logTweet' is the response given to a function. great for (logging purposes))
function pushTweet() {
    //T.post('statuses/update', {status: tweetScene.replace(/,/g, '')}, logTweet);
}

// logs tweet - (checks for errors in tweeting
function logTweet(err, data, response) {
    if (err) { //if 'err' is true, there was an error and the console log below is sent to the log.
        console.log(
            '\n**\n' +
            '>Error Tweeting.\n' +
            '**\n'
        );
    } else { //otherwise (false), it was successfully tweeted, and we show it to the log.
        //console.log('\n >Successfully Tweeted:\n' + tweetScene.replace(/,/g, '').replace(/"     "/g, '') + '\n__\n');
    }
}

// log pusher - (checks for errors in tweeting and pushes what has been created in createNature() to my log for testing and uh... (logging purposes))
function logScene() {
    var now = new Date();
    console.log (
        '....................' + '\n' +
        '>loop number: ' + loopN + '\n' +
        '>timestamp: ' + dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT") + '\n' +
        '====================' + '\n' +
        '-time: ' + time
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
    //grabs 'sceneInfo' returned from createNeature(), which pushes the nature scene as a tweet to the main twitter account
    createNature(); //this function grabs information from 'createNature()' which returned 'sceneInfo' array after generating a nature scene, and pushes that info to the log for (logging purposes)
    logScene();
    pushTweet(); //pushes the generated nature scene as a tweet to the main twitter account

    //log timers
    var bufferAmount = 0;
    var bufferTime = loopTime;
    process.stdout.write('Loop Timer: ' + bufferTime + ' seconds'); //process.stdout.write is used so that the timer counts down without making a new line

    //countdown and loop re-starter
    var countdownTimer = setInterval(function () {
        readline.cursorTo(process.stdout, 0);
        bufferTime -= 1;
        process.stdout.write('Loop Timer: ' + bufferTime);
        bufferAmount += 1;

        if (bufferTime <= 0) {
            clearInterval(countdownTimer);
            readline.clearLine(process.stdout);
            readline.cursorTo(process.stdout, 0);
            console.log('Buffer Time: ' + bufferAmount + ' seconds\n'); //prints out how much time was buffered between the loop (logging purposes)
            loopN += 1; //adds to total loop count since the program started looping
            startLoop(loopTime); //starts the loop over again (once bufferTime has run out)
        }
    }, 1000);
}

// main
console.log ( //(logging purposes)
    '********** tinynaturebot v1.2 **********\n' +
    '                  init                  \n'
);
//allows the console to ask a question
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var loopNum = 0;
rl.question(`loop duration in minutes? (ex. 60m = 60 minutes, 30s = 30 seconds): `, (input) => {
    if (input.includes('s') || input.includes('m')) {
        if (input.includes('m')) { //if inputer includes 'm' in their input, we treat the input as minutes and must convert it to seconds.
            loopNum = input.replace(/\D/g,'') * 60; //'startLoop' function relies on an input in seconds. this multiplies the inputer's 'minute' number by 60 to turn it from minutes to seconds.
        } else if (input.includes('s')) { //if inputer includes 's' in their input, we treat the input as seconds.
            loopNum = input.replace(/\D/g,''); //sets 'loopNum' to 'input' with all letters replaced
        }
        startLoop(loopNum); //begins the loop (it starts the infinite loop that continues to tweet on a NodeJS server. the number in startLoop() is fed into the startLoop() function above, and that loop uses the createNature() function to create the randomized scene. The chain gets more complicated as you dig into the functions, but as you wrap your head around it, the chain starts to make more sense as you realize each of the fucntions' purpose.)
        rl.close();
    } else {
        console.log("incorrect input. include 'm' or 's' in your input to denote if it is in minutes or seconds.");
    }
})