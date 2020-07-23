import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import { STORE_NAME } from '../config';
import OrderItemStyles from './styles/OrderItemStyles';

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        quantity
        title
        image
      }
    }
  }
`;

class OrderList extends React.Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <Error error={error} />;
          return (
            <div>
              <Head>
                <title>{STORE_NAME} - My Orders</title>
              </Head>
              <p>You have {orders.length} orders...</p>
              <OrderUl>
                {orders.map((order) => (
                  <OrderItemStyles key={order.id}>
                    <Link
                      href={{ pathname: '/order', query: { id: order.id } }}
                    >
                      <a>
                        <div className="order-meta">
                          <p>
                            {order.items.reduce(
                              (total, item) => item.quantity + total,
                              0
                            )}{' '}
                            Items
                          </p>
                          <p>
                            {formatDistance(order.createdAt, new Date())} ago
                          </p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map((item) => (
                            <img
                              src={item.image}
                              alt={item.title}
                              key={item.id}
                            />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </OrderUl>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default OrderList;
