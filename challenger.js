const { IgApiClient } = require("instagram-private-api")
var crypto = require('crypto');
var readlineSync = require('readline-sync');


const USERNAME = process.env.I_USERNAME
ig = new IgApiClient()
ig.state.generateDevice(USERNAME);

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
        const auth = await ig.account.login(USERNAME,PASSWORD).catch(async () => {
        console.log("Challenge accepted!");
        console.log(ig.state.checkpoint); // Checkpoint info here
        await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
        console.log(ig.state.checkpoint); // Challenge info here
        const code = readlineSync.question("Sms verification code")
        console.log(await ig.challenge.sendSecurityCode(code));
    });
    delete PASSWORD;
}

main().catch((res) => console.log("wowow caught error, " + res))