import React from 'react';
import gql from 'graphql-tag';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';
import Downshift, { resetIdCounter } from 'downshift';

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

function routeToItem(item) {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
}

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
    this.setState({ loading: false, items: res.data.items });
  }, 350); // delay 350ms for the debounce

  render() {
    resetIdCounter();
    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
          itemToString={(item) => (!item ? '' : item.title)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
              <ApolloConsumer>
                {(client) => (
                  <input
                    {...getInputProps({
                      onChange: (evt) => {
                        evt.persist(); // Since we're going to use the event in an async method
                        this.handleChange(evt, client);
                      },
                      type: 'search',
                      placeholder: 'search for an item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : null,
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.items.map((item, idx) => (
                    /* 'highlighted' prop is used by styled component */
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={idx === highlightedIndex}
                    >
                      <img src={item.image} alt={item.title} width="40px" />
                      <p>{item.title}</p>
                    </DropDownItem>
                  ))}
                  {!this.state.items.length && !this.state.loading && (
                    <DropDownItem>
                      Nothing found for '{inputValue}'
                    </DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default Search;
