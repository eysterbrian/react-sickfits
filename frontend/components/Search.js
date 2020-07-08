import React from 'react';
import gql from 'graphql-tag';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_QUERY = gql`
  query SEARCH_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      title
      image
    }
  }
`;

class Search extends React.Component {
  state = {
    loading: false,
    items: [],
  };
  handleChange = debounce(async (evt, client) => {
    if (evt.target.value.length === 0) {
      this.setState({ items: [] });
      return;
    }
    this.setState({ loading: true });
    // Manually query the apollo client
    const res = await client.query({
      query: SEARCH_QUERY,
      variables: { searchTerm: evt.target.value },
    });
    console.log('res :>> ', res);
    this.setState({ loading: false, items: res.data.items });
  }, 350); // delay 350ms for the debounce

  render() {
    return (
      <SearchStyles>
        <div>
          <ApolloConsumer>
            {(client) => (
              <input
                onChange={(evt) => {
                  evt.persist(); // Since we're going to use the event in an async method
                  this.handleChange(evt, client);
                }}
                type="search"
              />
            )}
          </ApolloConsumer>
          <DropDown>
            {this.state.items.map((item) => (
              <DropDownItem key={item.id}>
                <img src={item.image} alt={item.title} width="40px" />
                <p>{item.title}</p>
              </DropDownItem>
            ))}
          </DropDown>
        </div>
      </SearchStyles>
    );
  }
}

export default Search;
