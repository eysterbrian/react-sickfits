import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
    }
  }
`;

class Signup extends React.Component {
  state = {
    name: '',
    password: '',
    email: '',
  };
  saveToState = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  };
  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION}>
        {(signupMutation, { loading, error }) => {
          return (
            <Form
              method="POST"
              onSubmit={async (evt) => {
                evt.preventDefault();
                console.log('Signing up...');
                const res = await signupMutation({
                  variables: {
                    ...this.state,
                  },
                });
                console.log('Signed up!!!', res);
                this.setState({ name: '', email: '', password: '' });
              }}
            >
              <ErrorMessage error={error} />
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up For An Account</h2>
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    name="name"
                    placeholder="name"
                    value={this.state.name}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Sign Up!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
