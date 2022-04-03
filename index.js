const { ApolloServer } = require('apollo-server')

const typeDefs = require('./assets/typeDefs')
const resolvers = require('./assets/resolvers')

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
