const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const Strategy = require('passport-pizza');

const { MemoryUserStore } = require('./store.js');

const COOKIE_SECRET = "WoopDaWoop";


const userStore = new MemoryUserStore();

const strategy = new Strategy({
    pizzaAuthURL: 'http://localhost:9021',
    clientID: '123',
    clientSecret: '234',
    callbackURL: 'http://localhost:4000/login/callback',
},
function(accessToken, refreshToken, profile, cb) {
    profile.accessToken = accessToken;
    profile.lastUpdate = Date.now();
    let user = userStore.createOrUpdate(profile);
    console.log(user);
    cb(null, user);
});


function setupAuth(server) {

    passport.use(strategy);

    passport.serializeUser((user, cb) => { 
        let serial = userStore.serialize(user);
        cb(null, serial); 
    });
    passport.deserializeUser((serial, cb) => { 
        let user = userStore.deserialize(serial);

        // check if data is upToDate
        if(Date.now() - user.lastUpdate > 1000*2 ) {
            strategy.userProfile(user.accessToken, (err, result) => {
                let newUser = result;
                result.accessToken = user.accessToken;
                result.lastUpdate = Date.now();
                userStore.update(user);
                console.log("updated user from pizza");
            });
        }
        cb(null, user);
    });

    server.use(session({
        secret: COOKIE_SECRET,
        resave: true,
        saveUninitialized: true
    }));

    server.use(passport.initialize());
    server.use(passport.session());

    server.use(cookieParser(COOKIE_SECRET));

    server.get('/login', passport.authenticate('pizza'));
    server.get('/login/callback', passport.authenticate('pizza', 
        {failureRedirect: 'http://localhost:3000/'}),
        (req, res) => {
            res.redirect('http://localhost:3000/')
    });

    server.get('/logout', (req,res) => {
        req.logout();
        res.redirect('http://localhost:3000/');
    });
}

async function updateUser(user) {

}

module.exports = setupAuth;