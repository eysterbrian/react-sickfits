import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends React.Component {
  state = {
    email: '',
  };
  saveToState = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  };
  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestResetMutation, { error, loading, called }) => {
          return (
            <Form
              method="POST"
              onSubmit={async (evt) => {
                console.log('Request reset...');
                evt.preventDefault();
                const res = await requestResetMutation();
                this.setState({ email: '' });
              }}
            >
              <ErrorMessage error={error} />
              {!loading && !error && called && (
                <p>A password reset email has been sent!</p>
              )}
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset Password</h2>
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    onChange={this.saveToState}
                    value={this.state.email}
                  />
                </label>
                <button type="submit">Reset</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
