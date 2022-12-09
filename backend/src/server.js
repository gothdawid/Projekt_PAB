const { ApolloServer } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { resolvers } = require('./resolvers')
const { gql } = require('apollo-server')
const {readFileSync} = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const secret = process.env.SECRET;

const typeDefs = gql`${readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`;

// Nowa funkcja do sprawdzania tokenu JWT
const getUser = (req) => {
  // Pobierz token z nagłówka autoryzacji żądania
  const token = req.headers.authorization || '';

  try {
    // Weryfikuj token i zwracaj obiekt z informacjami o użytkowniku
    return jwt.verify(token, secret);
  } catch (err) {
    // Zwróć pusty obiekt, jeśli token jest nieprawidłowy
    return {};
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Przekazuj nową funkcję jako wartość klucza `context`
  context: ({ req }) => ({ user: getUser(req) }),
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
