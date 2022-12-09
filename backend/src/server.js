const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { resolvers } = require('./resolvers')
const { gql } = require('apollo-server')
const {readFileSync} = require('fs');
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient()
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.SECRET;
const typeDefs = gql`${readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`;

const getUser = (req) => {
  const token = req.headers.authorization || '';

  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return {};
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ 
    prisma: prisma,
    user: getUser(req),
    headers: req.headers || '',
   }),
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});