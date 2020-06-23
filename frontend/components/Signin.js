import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      name
    }
  }
`;

class Signin extends React.Component {
  state = {
    email: '',
    password: '',
  };
  saveToState = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  };
  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signinMutation, { error, loading, data }) => {
          return (
            <Form
              method="POST"
              onSubmit={async (evt) => {
                console.log('Signing in...');
                evt.preventDefault();
                const res = await signinMutation();
                console.log(`Signed in as: ${res.data.signin.name}`);
              }}
            >
              <ErrorMessage error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Login to Your Account</h2>
                <label htmlFor="email">
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
                <label htmlFor="password">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={this.saveToState}
                    value={this.state.password}
                  />
                </label>
                <button type="submit">Signin</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signin;
