//
// Create the graphql-yoga (express) server for our API
//
const { GraphQLServer } = require('graphql-yoga');

// Import our resolvers
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');

// Connect to our Prisma DB using prisma-binding
const db = require('./db');

// Create the GraphQL Yoga server
function createServer() {
  // This is the graphqh-yoga server
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql', // Define our API schema
    resolvers: {
      // Implement the API in the resolvers
      Mutation: Mutation,
      Query: Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    // Make the DB accessible from the resolver functions via the req context
    context: (req) => ({ ...req, db }),
  });
}

module.exports = createServer;
