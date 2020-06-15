import nextWithApollo from 'next-with-apollo'; // provides HOC to expose apollo within Next
import ApolloClient from 'apollo-boost'; // sensible defaults for apollo client
import { endpoint } from '../config';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,

    // Option provided by apollo-boost
    request: (operation) => {
      operation.setContext({
        // Include our credentials with every request (like a middleware)
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
  });
}

// Export higher-order fn created by calling nextWithApollo higher-order fn
export default nextWithApollo(createClient);
