const doctrines = [{
  id: 1,
  name: 'Bacon',
  slug: 'bacon',
  category: '1. Official',
  tags: ['shield', 'roaming', 'cheap'],
  public: true,
  roles: [
    {
      name: "DPS",
      sortingKey: 0,
      ships: [
        {
          ship: "abc",
          sortingKey: 0,
          public: true,
          count: ""
        }
      ]
    },{
      name: "Support",
      sortingKey: 1,
      ships: [
        {
          ship: "bcd",
          sortingKey: 1,
          public: true
        }
      ]
    }
  ]
}, {
  id: 2,
  name: 'Machariels',
  slug: 'machas',
  category: '1. Official',
  tags: ['armor', 'strategic', 'expensive'],
  public: true
}];

const ships = {
  "abc": {
    id: 23,
    name: "1MN Shield Web",
    shipTypeID: 234,
    shipTypeName: "Hyena"
  },
  "bcd": {
    id: 12,
    name: "1MN Shield",
    shipTypeID: 345,
    shipTypeName: "Harpy"
  },
  "def": {
    id: 34,
    name: "5MN Armor TP",
    shipTypeID: 234,
    shipTypeName: "Hyena"
  }
}
let nextId = 3;

const resolvers = {
  Query: {
    doctrines: () => {
      return doctrines;
    },
    doctrine: (obj, { id }, context) => {
      return doctrines.filter(d => d.id = id)[0];
    },
    currentUser: (root, args, context) => {
      return context.user || null;
    }
  },
  ShipEntry: {
    ship: (shipEntry) => {
      return ships[shipEntry.ship];
    }
  },
  User: {
    characterId: (root, args, context) => {
      return parseInt(context.user.crestToken[0].split(":")[0]);
    }
  }
};

module.exports = { resolvers };