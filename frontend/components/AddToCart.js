import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($itemId: ID!) {
    addToCart(itemId: $itemId) {
      id
      quantity
    }
  }
`;

class AddToCart extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };
  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{ itemId: id }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(addToCartMutation, { error, loading, data }) => (
          <button
            aria-busy={loading}
            disabled={loading}
            onClick={addToCartMutation}
          >
            Add{loading && 'ing'} This To Cart
          </button>
        )}
      </Mutation>
    );
  }
}

export default AddToCart;
