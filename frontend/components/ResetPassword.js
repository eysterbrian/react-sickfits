import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User'; // For refetchQuery in Mutation

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $passwordConfirm: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      passwordConfirm: $passwordConfirm
    ) {
      id
      email
      name
    }
  }
`;

class ResetPassword extends React.Component {
  state = {
    password: '',
    passwordConfirm: '',
  };

  saveToState = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          ...this.state,
          resetToken: this.props.resetToken,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetMutation, { data, loading, error }) => {
          return (
            <Form
              method="POST"
              onSubmit={async (evt) => {
                console.log('Resetting password...');
                evt.preventDefault();
                const res = await resetMutation();
                console.log(
                  `Password has been reset! Signed in as: ${res.data.resetPassword.name}`
                );
                Router.push({
                  pathname: '/',
                });
              }}
            >
              <ErrorMessage error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Set New Password</h2>
                <label htmlFor="password">
                  New Password
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="new password"
                    required
                    onChange={this.saveToState}
                    value={this.state.password}
                  />
                </label>
                <label htmlFor="passwordConfirm">
                  Confirm New Password
                  <input
                    type="password"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    placeholder="confirm password"
                    required
                    onChange={this.saveToState}
                    value={this.state.passwordConfirm}
                  />
                </label>
                <button type="submit">Reset Password</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default ResetPassword;
