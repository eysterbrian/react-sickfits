import { Query } from 'react-apollo';
import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      name
      email
      permissions
      cart {
        id
        quantity
        item {
          id
          title
          description
          image
          priceCents
        }
      }
    }
  }
`;

// Create a render prop component!!
const User = (props) => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {(payload) => props.children(payload)}
  </Query>
);

User.propTypes = {
  // Child must be a render prop
  children: PropTypes.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
