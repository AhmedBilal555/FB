const mongoose = require("mongoose");
const plm =require('passport-local-mongoose')
mongoose.connect('mongodb://localhost/facebook')
  .then(function () {
    console.log('connected');
  })
  .catch(function (err) {
    console.log(err);
  });
const UserSchema = mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String
});
UserSchema.plugin(plm);
module.exports=mongoose.model('user',UserSchema);