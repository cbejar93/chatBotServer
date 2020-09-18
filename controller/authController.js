const passport = require("passport");
const User = require('../models/User');



module.exports = (app) => {
    // This redericts people to the Facebook servers.
    app.get("/auth/facebook",  passport.authenticate("facebook", { scope: "email" }), (req, res) => {
      
    });

    // This catches the rederict from the facebook servers.
    app.get(
        "/auth/facebook/callback",
        
            passport.authenticate("facebook"),
            (req,res)=>{
                req.login(req._passport.session.user, function (err) { // <-- Log user in
                  console.log('in the login function with the req session save')
                  req.session.save(()=>{
                    console.log('in the sessions save.')

                    return res.redirect("http://localhost:8081/#/home");
                  })});
            }
    );

    app.get("/api/logout", (req, res) => {
        req.logout();
        res.redirect("http://localhost:8081/logout");
    })

    const authMiddleware = (req, res, next) => {
        console.log('in auth middleware');
        console.log(req.user);
        if (!req.isAuthenticated()) {
            console.log('user not authenticated')
          res.status(401).send('You are not authenticated')
        } else {
          console.log('USER IS AUTHENTICATED!!!')
          return next()
        }
      }

    app.get("/api/user", authMiddleware, async (req, res) => {
      console.log(req.user._id);
        
       let user =  await User.findById(req.user._id);
      
        console.log([user, req.session])
      
        res.send({ user: user })
      })

}