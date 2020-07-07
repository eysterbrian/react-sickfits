import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from './User';

const RemoveFromCartStyles = styled.button`
  font-size: 3rem;
  background: none;
  border: none;
  &:hover {
    color: ${(props) => props.theme.red};
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      id
    }
  }
`;

const RemoveFromCart = ({ itemId }) => (
  <Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{ itemId }}>
    {(removeFromCartMutation, { loading, data }) => (
      <RemoveFromCartStyles
        disabled={loading}
        aria-busy={loading}
        onClick={() =>
          removeFromCartMutation().catch((err) => alert(err.message))
        }
      >
        &times;
      </RemoveFromCartStyles>
    )}
  </Mutation>
);

RemoveFromCart.propTypes = {
  itemId: PropTypes.string.isRequired,
};

export default RemoveFromCart;
