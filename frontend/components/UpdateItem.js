import React from 'react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import ErrorMessages from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      priceCents
      image
      largeImage
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $priceCents: Int
    $image: String
    $largeImage: String
  ) {
    updateItem(
      id: $id
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

export default class UpdateItem extends React.Component {
  // Initialize state to simplify (this.state.prop) checks
  state = {};
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  // Reusable change handler for all the form elements
  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? Number(value) : value;
    this.setState({ [name]: val });
    // Note that in this component, we're not actually displaying state in the UI. Instead our components are
    // uncontrolled. And we just set the initial value using JSX's defaultValue attribute.
  };

  uploadFile = async (e) => {
    console.log('Uploading file...');
    const files = e.target.files;

    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'brianfits');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/eysterbrian/image/upload',
      { method: 'POST', body: data }
    );
    const file = await res.json();
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log('Updating item...');
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
    console.log('Updated!!!');
  };
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {/* Render prop */}
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <ErrorMessages error={error} />;
          if (!data.item) return <p>No item found for ID {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {/* Render Prop */}
              {(updateItemMutation, { loading, error }) => (
                <Form onSubmit={(e) => this.updateItem(e, updateItemMutation)}>
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
                        defaultValue={data.item.title}
                      />
                    </label>

                    <label htmlFor="file">
                      Image
                      <input
                        type="file"
                        id="file"
                        name="file"
                        placeholder="Image"
                        required
                        onChange={this.uploadFile}
                      />
                      {(this.state.image || data.item.image) && (
                        <img
                          src={this.state.image || data.item.image}
                          width="200"
                          alt="Image Preview"
                        />
                      )}
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
                        defaultValue={data.item.priceCents}
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
                        defaultValue={data.item.description}
                      />
                    </label>
                    <button type="submit">
                      Sav{loading ? 'ing' : 'e'} Changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}
