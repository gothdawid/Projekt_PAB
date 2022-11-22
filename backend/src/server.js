const { ApolloServer } = require('apollo-server')
const { resolvers } = require('./resolvers')
const { context } = require('./context')
const { gql } = require('apollo-server')
const {readFileSync} = require('fs');

const typeDefs = gql`${readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`;

const server = new ApolloServer({ typeDefs, resolvers, context: context })

server.listen().then(({ url }) =>
  console.log(`
🚀 Server ready at: ${url}
⭐️ See sample queries: http://pris.ly/e/js/graphql-sdl-first#using-the-graphql-api`),
)
