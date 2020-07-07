import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

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
      <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ itemId: id }}>
        {(addToCartMutation, { error, loading, data }) => (
          <button onClick={addToCartMutation}>Add This To Cart</button>
        )}
      </Mutation>
    );
  }
}

export default AddToCart;
