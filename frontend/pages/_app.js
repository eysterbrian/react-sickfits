import App from 'next/app';
import Page from '../components/Page';

import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

class MyApp extends App {
  // Define this method so we can inject the ctx.query into pageProps
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    // If our component defines getInitialProps then store the result in pageProps
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    // Now add our query, so it's available to the user
    pageProps.query = ctx.query;

    return { pageProps };
  }

  render() {
    const { Component, pageProps, apollo } = this.props;

    return (
      <ApolloProvider client={apollo}>
        <Page>
          <Component {...pageProps} />
        </Page>
      </ApolloProvider>
    );
  }
}

// Call the higher-order function to inject the apollo client into our App as a prop
export default withData(MyApp);
