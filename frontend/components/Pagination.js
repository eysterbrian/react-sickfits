import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage, STORE_NAME } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = ({ page }) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error...</p>;
      const count = data.itemsConnection.aggregate.count;
      const pages = Math.ceil(count / perPage);
      return (
        <PaginationStyles>
          <Head>
            <title>
              {STORE_NAME} | Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{ pathname: 'items', query: { page: page - 1 } }}
          >
            <a aria-disabled={page <= 1} className="prev">
              Prev
            </a>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>{count} items total</p>
          <Link
            prefetch
            href={{ pathname: 'items', query: { page: page + 1 } }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

Pagination.propTypes = {
  page: PropTypes.number,
};

export default Pagination;
