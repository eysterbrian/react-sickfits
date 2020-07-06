import nextWithApollo from 'next-with-apollo'; // provides HOC to expose apollo within Next
import ApolloClient from 'apollo-boost'; // sensible defaults for apollo client
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';

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

    // Define our local store using the apollo-boost API (instead of apollo-link-state)
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_root, args, ctx, _info) {
            const cache = ctx.cache;
            // Get the current state of cartOpen from local state
            const { cartOpen } = cache.readQuery({ query: LOCAL_STATE_QUERY });
            // Toggle current value. We'll return this toggled value.
            const data = { data: { cartOpen: !cartOpen } };
            cache.writeData(data);
            return data;
          },
        },
      },
      defaults: {
        cartOpen: false,
      },
    },
  });
}

// Export higher-order fn created by calling nextWithApollo higher-order fn
export default nextWithApollo(createClient);
