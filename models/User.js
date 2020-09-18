const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema ({
    _id: {type: Schema.ObjectId, auto: true},
    facebookId:  {type: String, required: true },
    userName: {type: String, required: true },
    userPicture: {type: String, required: false},
    email: {type: String, required: false},
    access: {type: String, required:true },
    
   
});

const User = mongoose.model('userCollection', userSchema, 'userCollection');

module.exports = User;

