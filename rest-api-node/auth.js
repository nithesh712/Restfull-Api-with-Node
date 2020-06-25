const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      //GEt USer by email
      const user = await user.findOne({ email });

      //Match Password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          resolve(user);
        } else {
          //Password not match
          reject("Authentication Failed");
        }
      });
    } catch (err) {
      //Email not Found
      reject("Authntication Failed");
    }
  });
};
