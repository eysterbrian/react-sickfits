import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

// Query whose cache we'll update after the delete
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export default class DeleteItem extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  updateCache = (cache, payload) => {
    console.log('Updating cache...');
    // Get all items currently in cache
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // Create copy of the cache with our deleted item removed
    const updatedItems = data.items.filter(
      // Payload is from the original deleteItem mutation
      (item) => item.id !== payload.data.deleteItem.id
    );
    // Now replace the cache with this new list of items
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data: { items: updatedItems } });
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.updateCache}
      >
        {(deleteItemMutation, { loading, error }) => {
          return (
            <button
              onClick={async (e) => {
                if (confirm('Are you sure you want to delete?')) {
                  console.log('Deleting an item...');
                  const res = await deleteItemMutation();
                  console.log('Item deleted!!!');
                }
              }}
            >
              {this.props.children}
            </button>
          );
        }}
      </Mutation>
    );
  }
}
