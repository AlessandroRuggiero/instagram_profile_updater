const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');
require('dotenv').config();

const USERNAME = process.env.IG_USERNAME;
const PASSWORD = process.env.IG_PASSWORD;

const my_birth = new Date (2003, 4, 9, 23, 23, 0, 0)

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
    const now = new Date ();
    return calculateAge(my_birth);
}

const ig = new IgApiClient();
// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
ig.state.generateDevice(USERNAME);
(async () => {
  // Execute all requests prior to authorization in the real Android application
  // Not required but recommended
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(USERNAME, PASSWORD).catch(err => {
    console.log('Error logging in: ', err);
  });
  console.log(loggedInUser);
  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  //process.nextTick(async () => await ig.simulate.postLoginFlow());
  // Create UserFeed instance to get loggedInUser's posts
  const userFeed = ig.feed.user(loggedInUser.pk);
  console.log(userFeed);

while (true){
  await ig.account.setBiography(get_bio()).then((response) => {
    console.log(response);
  });
  await sleep(60*5);
    
}
//   await ig.media.like({
//     // Like our first post from first page or first post from second page randomly
//     mediaId: sample([myPostsFirstPage[0].id, myPostsSecondPage[0].id]),
//     moduleInfo: {
//       module_name: 'profile',
//       user_id: loggedInUser.pk,
//       username: loggedInUser.username,
//     },
//     d: sample([0, 1]),
//   });
})();