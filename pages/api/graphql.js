import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-micro'
import httpHeadersPlugin from 'apollo-server-plugin-http-headers'
import jwt from 'jsonwebtoken'
import Cors from 'micro-cors'
import withSession from '../../apollo/session'
import resolvers from '../api/lib/resolvers/index'
import typeDefs from '../api/lib/typeDefs'
import { getUserFromToken } from './auth'

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'], // Asegúrate de incluir los métodos que necesitas
  allowHeaders: ['Content-Type', 'Authorization'],
  origin: 'https://app-foodi-admin.vercel.app' // El dominio permitido
});


const apolloServer = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground(), httpHeadersPlugin],
  context: withSession(async ({ req, next, connection }) => {
    let User = {}
    let tokenClient
    if (connection) {
      return connection.context
    }
    const setCookies = []
    const setHeaders = []
    const { token } = req.session.get('user') || {}
    tokenClient = req.headers.authorization?.split(' ')[1]
    const restaurant = req.headers.restaurant || {}
    const excluded = ['/login', '/forgotpassword', '/register', '/teams/invite/[id]', '/teams/manage/[id]']
    if (excluded.indexOf(req.session) > -1) return next()
    const { error } = await getUserFromToken(token)
    if (error) req.session.destroy()
    if (token) {
      User = await jwt.verify(token, process.env.AUTHO_USER_KEY)
      return { req, setCookies: setCookies || [], setHeaders: setHeaders || [], User: User || {}, restaurant: restaurant || {} }
    } else if (tokenClient) {
      User = await jwt.verify(tokenClient, process.env.AUTHO_USER_KEY)
      return { req, setCookies: setCookies || [], setHeaders: setHeaders || [], User: User || {}, restaurant: restaurant || {} }
    }
  }),
  subscriptions: {
    path: '/api/graphqlSubscriptions',
    keepAlive: 9000,
    // eslint-disable-next-line no-unused-vars
    onConnect: (connectionParams, webSocket, context) => {return console.log('connected')},
    onDisconnect: (webSocket, context) => {return console.log('disconnected')}
  },
  playground: {
    subscriptionEndpoint: '/api/graphqlSubscriptions',
    settings: {
      'request.credentials': 'same-origin'
    }
  }
})
const startServer = apolloServer.start()

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  await startServer
  const handler = (apolloServer.createHandler({ path: '/api/graphql' }))
  return handler(req, res)
})
export const config = {
  api: {
    bodyParser: false,
    playground: true
  }
}
