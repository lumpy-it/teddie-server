const {
  makeExecutableSchema
} = require('graphql-tools');

const { resolvers } = require('./resolvers');

const typeDefs = `
type Doctrine {
   id: ID!
   name: String!
   slug: String!
   category: String!
   tags: [String]
   public: Boolean!
   description: String
   roles: [Role]
}
type Role {
  name: String!
  sortingKey: Int!
  ships: [ShipEntry]
}
type ShipEntry {
  ship: Ship!
  sortingKey: Int!
  public: Boolean!
  count: String
  comment: String
}
type Ship {
  id: ID!
  name: String!
  shipTypeID: Int!
  shipTypeName: String!
}

type User {
  uid: String!
  characterName: String!
  corporation: String!
  alliance: String
  accountStatus: String!
  authGroups: [String]
  characterId: Int!
}

# This type specifies the entry points into our API. In this case
# there is only one - "channels" - which returns a list of channels.
type Query {
   doctrines: [Doctrine]    # "[]" means this is a list of channels
   doctrine(id: ID): Doctrine
   currentUser: User
}

type Mutation {
  addDoctrine(name: String!, slug: String!, category: String! ): Doctrine
}
`;
const schema = makeExecutableSchema({ typeDefs, resolvers });
//addMockFunctionsToSchema({ schema });
module.exports = { schema };