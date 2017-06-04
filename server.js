const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const Strategy = require('passport-pizza');

const {graphqlExpress, graphiqlExpress} = require('graphql-server-express');
const { schema } = require('./src/schema');

const PORT = 4000;
const COOKIE_SECRET = "WoopDaWoop";
const CLIENT_ID = '123';
const CLIENT_SECRET = '234';


const server = express();

//server.use('*', cors({origin: 'http://localhost:3000'}));
server.use(cookieParser(COOKIE_SECRET));

passport.use(new Strategy({
  pizzaAuthURL: 'http://localhost:9021',
  clientID: '123',
  clientSecret: '234',
  callbackURL: 'http://localhost:4000/login/callback',
},
function(accessToken, refreshToken, profile, cb) {
  cb(null, profile);
}));


passport.serializeUser((user, cb) => { cb(null, user); });
passport.deserializeUser((user, cb) => { cb(null, user); });

server.use(session({
  secret: COOKIE_SECRET,
  resave: true,
  saveUninitialized: true
}));

server.use(passport.initialize());
server.use(passport.session());

server.get('/test', (req, res) => {
  console.log(req);
  res.send('Hello World!');
});

server.get('/login', passport.authenticate('pizza'));
server.get('/login/callback', passport.authenticate('pizza', 
  {failureRedirect: '/'}),
  (req, res) => {
    res.redirect('/')
  });

server.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/');
})
server.use('/graphql', bodyParser.json(), graphqlExpress((req) => {
  console.log(req.user);
  return { schema };
  //return { schema, context: { user } };
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

server.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
