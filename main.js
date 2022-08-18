const { IgApiClient } = require("instagram-private-api")
var crypto = require('crypto');
var readlineSync = require('readline-sync');

ig = new IgApiClient()

const USERNAME = process.env.I_USERNAME
const my_birth = new Date (2003, 5, 9, 23, 23, 0, 0)

ig.state.generateDevice(USERNAME)

/**
 * Translates seconds into human readable format of seconds, minutes, hours, days, and years
 * 
 * @param  {number} seconds The number of seconds to be processed
 * @return {string}         The phrase describing the amount of time
 */
 function forHumans ( seconds ) {
    var levels = [
        [Math.floor(seconds / 31536000), 'years'],
        [Math.floor((seconds % 31536000) / 86400), 'days'],
        [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
        [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
        [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
    ];
    var returntext = '';

    for (var i = 0, max = levels.length; i < max; i++) {
        if ( levels[i][0] === 0 ) continue;
        returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
    };
    return returntext.trim();
}

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function get_bio () {
    const now = new Date ()
    const delta = Math.floor((now-my_birth)/1000)
    return forHumans (delta) + " old"
}

function decrypt (text,password){
    const algorithm = 'aes256'; 
    var decipher = crypto.createDecipher(algorithm, password);
    var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted
}

function get_password () {
    var pass = readlineSync.questionNewPassword("Password: ");
    return decrypt(process.env.I_PASSWORD,pass);
}

const main = async () => {
    const PASSWORD = get_password();
    await ig.simulate.preLoginFlow().catch((err) => console.log (`Error in preLoginFlow, should not be a problem --> (${err})`));
    await ig.account.login(USERNAME,PASSWORD);
    delete PASSWORD;

    while (true)  {
        await sleep (30);
        await ig.account.setBiography(get_bio());
        await sleep(30);
    }
}


main().catch((res) => console.log("wowow caught error, " + res))



// useless 
    // log out of Instagram when done
    // process.nextTick(async () => {
    //     try {
    //         await ig.simulate.postLoginFlow()
    //     }catch (e) {    
    //         console.log ("oh oh")
    //         console.error(e);
    //     }
        
    // })