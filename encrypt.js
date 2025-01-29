//Generate encrypted password for your admin so that you can set it
//in a manually/programatically created admin user's password field.
//Remember to never store passwords in plaintext, be it for your user or your admin

const bcrypt = require("bcryptjs");

async function encryptPassword(password) {
  try {
    const saltRounds = 12; // Set salt rounds to whatever you want
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Encrypted Password:", hashedPassword);
  } catch (error) {
    console.error("Error encrypting password:", error);
  }
}

//Replace 'yourpasswordhere' with the password you want to encrypt
const password = "yourpasswordhere";

//In the root of the directory run node encrypt.js in the command
//line to generate your encrypted password
encryptPassword(password);
