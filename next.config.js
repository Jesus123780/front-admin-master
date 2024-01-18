/* eslint-disable */
const withPlugins = require('./scripts/next-compose-plugins/lib')
const withTM = require('next-transpile-modules')([
  'pkg-components',
  'npm-pkg-hook'
]) // pass the modules you would like to see transpiled

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  disable: process.env.NODE_ENV === 'development'
})

/** @type {import('next').NextConfig} */
module.exports = async (phase) => {
  const env = {
    URL_ADMIN_SERVER_SOCKET_HTTPS: process.env.URL_ADMIN_SERVER_SOCKET_HTTPS,
    BUSINESS_TITLE: process.env.BUSINESS_TITLE,
    LOCAL_SALES_STORE: process.env.LOCAL_SALES_STORE,
    IMAGE_FACE_KEY: process.env.IMAGE_FACE_KEY,
    SESSION_NAME: process.env.SESSION_NAME,
    SECRET_CLIENT_ID_LOGIN_GOOGLE: process.env.SECRET_CLIENT_ID_LOGIN_GOOGLE,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SESSION_KEY: process.env.SESSION_KEY,
    URL_BASE: process.env.URL_BASE,
    URL_BACK_SERVER: process.env.URL_BACK_SERVER,
    MAIN_URL_BASE: process.env.MAIN_URL_BASE,
    CLIENT_ID_LOGIN_GOOGLE: process.env.CLIENT_ID_LOGIN_GOOGLE,
    URL_ADMIN_SERVER: process.env.URL_ADMIN_SERVER,
    URL_ADMIN_SERVER_SOCKET: process.env.URL_ADMIN_SERVER_SOCKET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    AUTHO_USER_KEY: process.env.AUTHO_USER_KEY,
    REACT_APP_API_KEY_GOOGLE_MAPS: process.env.REACT_APP_API_KEY_GOOGLE_MAPS,
    ACCESS_SID_TWILIO: process.env.ACCESS_SID_TWILIO,
    ACCESS_TOKEN_AUTH_TWILIO: process.env.ACCESS_TOKEN_AUTH_TWILIO,
    SECRET_KEY: process.env.SECRET_KEY,
    DIALECT_DB: process.env.DIALECT_DB,
    PORT_DB: process.env.PORT_DB,
    HOST_DB: process.env.HOST_DB,
    NAME_DB: process.env.NAME_DB,
    USER_DB: process.env.USER_DB,
    PASS_DB: process.env.PASS_DB
  }

  const images = {
    domains: [
      'http2.mlstatic.com',
      'localhost',
      'front-back-server.onrender.com',
      '*'
    ]
  }

  const headers = async () => {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'x-custom-header-1',
            value: 'my custom header 1'
          }
        ]
      }
    ]
  }

  const nextConfig = {
    env,
    eslint: {
      ignoreDuringBuilds: true,
    },
    images,
    reactStrictMode: true,
    headers,
    optimizeFonts: true,
    swcMinify: false,
    webpack: (config, { isServer }) => {
      // if (!isServer) {
      //   // Agregar la ruta de node_modules a la resolución de módulos de webpack
      //   config.resolve.modules.push(path.resolve(__dirname, 'node_modules'));
      // }
      config.resolve.alias = {
        ...config.resolve.alias,
        // Will make webpack look for these modules in parent directories
        'pkg-components': require.resolve('pkg-components')
      }
      return config
    }
  }

  const defaultConfig = nextConfig

  return withPlugins( [withTM], [withPWA], nextConfig)(phase, { defaultConfig })
}