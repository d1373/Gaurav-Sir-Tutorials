
const bcrypt = require('bcryptjs');

const password = 'admin-gaurav';
const saltRounds = 10;

bcrypt.genSalt(saltRounds, function(err, salt) {
  if (err) throw err;
  bcrypt.hash(password, salt, function(err, hash) {
    if (err) throw err;
    console.log(`Hashed password: ${hash}`);
  });
});
