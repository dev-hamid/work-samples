var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var userSchema = mongoose.Schema({
  email:{type:String,required:true},
  password:{type:String,required:true}
});

userSchema.methods.encrypt = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(7), null);
};

userSchema.methods.valid = (password)=>{
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User',userSchema);
