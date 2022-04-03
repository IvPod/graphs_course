const path = require('path')
const { ApolloServer } = require('apollo-server-fastify')
const {
  ApolloServerPluginDrainHttpServer,
} = require('apollo-server-core')

const typeDefs = require('./assets/typeDefs')
const resolvers = require('./assets/resolvers')

const PORT = process.env.PORT || 5000

const app = require('fastify')({ logger: true })

app.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
})

function fastifyAppClosePlugin(app) {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close()
        },
      }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    fastifyAppClosePlugin(app),
    ApolloServerPluginDrainHttpServer({
      httpServer: app.server,
    }),
  ],
})

const start = async () => {
  try {
    await server.start()
    app.register(server.createHandler())
    await app.listen(PORT, '0.0.0.0')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
