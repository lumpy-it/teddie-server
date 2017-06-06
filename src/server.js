const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const {graphqlExpress, graphiqlExpress} = require('graphql-server-express');
const { schema } = require('./schema/schema.js');

const setupAuth = require('./auth/auth.js');

const PORT = 4000;
const CLIENT_ID = '123';
const CLIENT_SECRET = '234';

const server = express();

server.use('*', cors({origin: 'http://localhost:3000'}));
//server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

setupAuth(server);

server.use('/graphql', graphqlExpress((req) => {
  return { schema, context: { user: req.user } };
}));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

server.listen(PORT, () => console.log(`GraphQL Server is now running on http://localhost:${PORT}`));
