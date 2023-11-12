import {
    ApolloClient,
    ApolloLink,
    split
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { createUploadLink } from 'apollo-upload-client'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { Cookies } from 'npm-pkg-hook'
import { useMemo } from 'react'
import { cache, isLoggedVar } from './cache'
import { typeDefs } from './schema'
import { URL_ADMIN, URL_BASE_ADMIN_MASTER } from './urls'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient

export const getDeviceId = async () => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  const { visitorId } = result || {}
  return visitorId
}

const removeDoubleQuotes = (text = '') => {
  return text?.replace(/['"]+/g, '')
}

const authLink = async () => {
  try {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('session')
      const restaurant = removeDoubleQuotes(Cookies.get('restaurant'))
      return {
        authorization: token ? `Bearer ${token}` : 'Bearer', // Corregido: Si no hay token, establece 'Bearer'
        restaurant: restaurant ?? '', // Corregido: Usa el valor de restaurant o cadena vacía si es nulo
        deviceid: ''
      }
    }

    return {
      authorization: 'Bearer',
      restaurant: '',
      deviceid: ''
    }
  } catch (error) {
    return {
      authorization: 'Bearer',
      restaurant: '',
      deviceid: ''
    }

  }
}


// Create Second Link
// https:graphql
function getWebSocketHeaders() {
  try {
    const token = Cookies.get('session') // Obtén el token de la cookie 'session'
    const restaurant = removeDoubleQuotes(Cookies.get('restaurant')) // Obtén el restaurante de la cookie 'restaurant'

    if (!token || !restaurant) {
      throw new Error('Authentication tokens are missing')
    }

    return {
      authorization: `Bearer ${token}`,
      restaurant: restaurant
    }
  } catch (error) {
    return {
      authorization: `Bearer`,
      restaurant: ''
    }
  }
}

function getWebSocketConnectionParams() {
  return {
    credentials: 'include',
    headers: getWebSocketHeaders()
  }
}

const wsLink = typeof window !== 'undefined' ? new WebSocketLink({
  uri: `${process.env.URL_ADMIN_SERVER_SOCKET}/graphql`,
  options: {
    reconnect: true,
    lazy: true,
    inactivityTimeout: 30000,
    timeout: 10000,
    connectionCallback: handleWebSocketConnectionCallback,
    wsOptionArguments: {
      headers: getWebSocketHeaders()
    },
    connectionParams: getWebSocketConnectionParams()
  }
}) : null


function handleWebSocketConnectionCallback(res) {
  // eslint-disable-next-line no-console
  console.log('WebSocket connected:', res)
}

function createApolloClient() {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      // eslint-disable-next-line no-console
      graphQLErrors.map(({ message, location, path }) => { return console.log(`[GraphQL error]: Message: ${message}, Location: ${location}, Path: ${path}`) }
      )

    // eslint-disable-next-line no-console
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })
  const ssrMode = typeof window === 'undefined' // Disables forceFetch on the server (so queries are only run once)
  const getLink = async (operation) => {
    const headers = await authLink()
    const service = operation.getContext().clientName
    let uri = `${process.env.URL_BACK_SERVER}/graphql`
    if (service === 'main') uri = `${process.env.URL_BACK_SERVER}/graphql`
    if (service === 'admin-store') uri = `${URL_ADMIN}graphql`
    if (service === 'admin') uri = `${URL_BASE_ADMIN_MASTER}graphql`
    if (service === 'admin-server') uri = `${process.env.URL_ADMIN_SERVER_SOCKET_HTTPS}`
    const token = Cookies.get('session')
    const context = operation.getContext()
    const { headers: ctx } = context || {}
    const { restaurant } = ctx || {}
    operation.setContext({
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
        client: 'front-admin'
      }
    })


    if (!restaurant) {
      isLoggedVar({ state: false, expired: true, message: 'Inicie session', code: 403 })
    }
    const link = createUploadLink({
      uri,
      credentials: 'same-origin',
      authorization: service === 'admin-server' || service === 'subscriptions' ? `Bearer ${token}` : `${restaurant}`,

      headers: {
        ...headers
      }
    })
    return link.request(operation)
  }
  const defaultOptions = {
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first'
    },
    mutate: {
      errorPolicy: 'all'
    }
  }
  const link = ssrMode ? ApolloLink.split(() => { return true }, operation => { return getLink(operation) }
  ) : !ssrMode
    ? split((operation) => {
      const definition = getMainDefinition(operation.query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    ApolloLink.split(() => { return true }, operation => { return getLink(operation) },
      errorLink
    )
    )
    : ApolloLink.split(() => { return true }, operation => { return getLink(operation) },
      errorLink
    )
  return new ApolloClient({
    connectToDevTools: true,
    ssrMode,
    link: link,
    defaultOptions,
    typeDefs,
    cache
  })
}
export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()
  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()
    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => {
        return [
          ...sourceArray,
          ...destinationArray.filter(d => { return sourceArray.every(s => { return !isEqual(d, s) }) }
          )
        ]
      }
    })
    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient
  return _apolloClient
}
export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }
  return pageProps
}
export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => { return initializeApollo(state) }, [state])
  return store
}
