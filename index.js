// we are using commonJS syntax below
// to instead use es6 with babel, follow this tutorial
// https://www.apollographql.com/blog/tutorial-building-a-graphql-server-cddaa023c035

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const models = require("./models");
// Construct a schema, using GraphQL schema language
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// const typeDefs = gql`
//   type Query {
//     hello: String
//   }
// `;

// Provide resolver functions for your schema fields
// const resolvers = {
//   Query: {
//     hello: (_parent, _args, _context, _server) => "Hello world!",
//   },
// };

const typeDefs = require("./schema/typeDefs.js");
const resolvers = require("./schema/resolvers.js");

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: (_req, _res) => {
    return { models, user: { id: 2 } };
  },
});

const app = express();
server.applyMiddleware({ app });

// pass { force: true } to sync if we want to recreate
// all the tables
models.sequelize.sync().then(app.listen({ port: 4000 }));
// app.listen({ port: 4000 }, () =>
//   console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
// );
