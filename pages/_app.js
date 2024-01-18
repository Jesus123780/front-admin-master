import { ApolloProvider } from '@apollo/client'
import { Layout as MainLayout } from 'components/layout'
import Context from 'context/Context'
import PropTypes from 'prop-types'
import { GlobalStyle } from 'public/styles/GlobalStyle'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { useApollo } from '../apollo/apolloClient'
import '../public/styles/tokens.css'
import '../styles/globals.css'

function MyApp ({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps)
  const Layout = Component.Layout ? Component.Layout : MainLayout

  return (
    <Context>
      <ApolloProvider client={apolloClient}>
        <GlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </Context>
  )
}

MyApp.propTypes = {
  Component: PropTypes.shape({
    Layout: PropTypes.any
  }),
  pageProps: PropTypes.any
}


export default MyApp
export const EmptyLayout = ({ children }) => { return <div>{children}</div> }

EmptyLayout.propTypes = {
  children: PropTypes.node.isRequired
}

