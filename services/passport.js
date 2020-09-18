const keys = require("../config/key");
const passport = require("passport");
const facebookStrategy = require('passport-facebook').Strategy
const mongoose = require("mongoose");
const User = require('../models/User');




// This created a unique id for the user
passport.serializeUser((user, done) => {
    console.log(' serizlize function.');
    console.log(user.id);
    done(null, user.id);
})

// this decodes the unique id sent from the browser
passport.deserializeUser((id, done) => {
    console.log('in the deserialize portion checking for id.')
    console.log(id)
    User.findById(id)
        .then(user => {
            console.log('after finding a user in deserialize');
            
            done(null, user);
        })
})


passport.use(new facebookStrategy({


    clientID: keys.appID,
    clientSecret: keys.appSecret,
    callbackURL: keys.callBack,
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']

},
    async (accessToken, refreshToken, profile, done) => {
       
        const oldUser = await User.findOne({ facebookId: profile.id })
        console.log('searching for a user.');



        if (oldUser) {
            console.log('previous user');
            done(null, oldUser)
        } else {
            console.log('in the new user section.');
            console.log(profile.photos[0].value);

            const user = await new User({ facebookId: profile.id, userName: profile.displayName, userPicture: profile.photos[0].value, email: profile.email, access: 'general' }).save()
            console.log(user);
            done(null, user);
        }


    }
));

