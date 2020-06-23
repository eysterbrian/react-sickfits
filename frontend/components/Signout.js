import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = (props) => (
  <Mutation mutation={SIGNOUT_MUTATION} refetchQueries={['CURRENT_USER_QUERY']}>
    {(signoutMutation) => <a onClick={signoutMutation}>Sign Out</a>}
  </Mutation>
);

export default Signout;
