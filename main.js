const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');
require('dotenv').config();

const USERNAME = process.env.IG_USERNAME;
const PASSWORD = process.env.IG_PASSWORD;
const sleepTime = process.env.SLEEP_TIME || 60*5;
const date = Date.parse(process.env.MY_BIRTH); //like 2023-01-10T23:23:00.000Z
const my_birth = new Date(date);

console.log('Username: ', USERNAME);
console.log("Birth: ", my_birth);


function calculateAge(birthDate) {
    const now = new Date();
    
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();
    
    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    return `${years} years ${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds old`;
}

if (!USERNAME || !PASSWORD) {
  throw new Error('Please specify IG_USERNAME and IG_PASSWORD in .env file');
}

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function get_bio () {
    return calculateAge(my_birth);
}

const ig = new IgApiClient();
ig.state.generateDevice(USERNAME);
(async () => {
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(USERNAME, PASSWORD).catch(err => {
    console.log('Error logging in: ', err);
  });
  console.log(loggedInUser);
  const userFeed = ig.feed.user(loggedInUser.pk);
  console.log(userFeed);

while (true){
  console.log('Updating bio');
  await ig.account.setBiography(get_bio()).then((response) => {
    console.log(response);
  });
  await sleep(sleepTime);
    
}
})();