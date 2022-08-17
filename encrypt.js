var crypto = require('crypto');
const algorithm = 'aes256';

var key = process.argv[3]
var cipher = crypto.createCipher(algorithm, key); 
let text = process.argv[2]
var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');

console.log(encrypted)