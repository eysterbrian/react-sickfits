import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessages from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $priceCents: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      priceCents: $priceCents
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

export default class CreateItem extends React.Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    priceCents: 0,
  };
  // Reusable change handler for all the form elements
  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? Number(value) : value;
    this.setState({ [name]: val });
    console.log({ name, type, value });
  };
  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {/* Render Prop */}
        {(createItemFn, { loading, error }) => (
          <Form
            onSubmit={async (e) => {
              // Stop the form from submitting
              e.preventDefault();
              console.log(this.state);
              // Call the mutation
              const res = await createItemFn();
              console.log(res.data);

              // Redirect to the single item page
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id },
              });
            }}
          >
            <ErrorMessages error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  onChange={this.handleChange}
                  value={this.state.title}
                />
              </label>

              <label htmlFor="priceCents">
                Price
                <input
                  type="number"
                  id="priceCents"
                  name="priceCents"
                  placeholder="Price"
                  required
                  onChange={this.handleChange}
                  value={
                    this.state.priceCents !== 0 ? this.state.priceCents : ''
                  }
                />
              </label>

              <label htmlFor="description">
                Description
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter a description"
                  required
                  onChange={this.handleChange}
                  value={this.state.description}
                />
              </label>
              <button type="submit"> Submit </button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}
