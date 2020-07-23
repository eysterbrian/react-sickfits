import React from 'react';
import PropTypes from 'prop-types';

import { Query } from 'react-apollo';
import { format } from 'date-fns';
import Head from 'next/head';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import { STORE_NAME } from '../config';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
        name
        email
      }
      items {
        id
        title
        description
        image
        largeImage
        priceCents
        quantity
      }
    }
  }
`;

class Order extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
        {({ loading, error, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          const order = data.order;
          return (
            <OrderStyles>
              <Head>
                <title>
                  {STORE_NAME} | Order {order.id}
                </title>
              </Head>
              <p>
                <span>Order ID: </span>
                <span>{order.id}</span>
              </p>
              <p>
                <span>Total cost:</span> <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>Charge ID:</span>
                <span>{order.charge}</span>
              </p>
              <p>
                <span>Date:</span>
                <span>
                  {format(order.createdAt, 'EEEE, MMMM d, YYYY @ h:mm b')}
                </span>
              </p>
              <p>
                <span>Item Count:</span>
                <span>{order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} alt={item.title} width="40px" />
                    <div className="item-details">
                      <h2>{item.title}</h2>
                      <p>Price: {formatMoney(item.priceCents)}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>
                        Subtotal: {formatMoney(item.quantity * item.priceCents)}
                      </p>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          );
        }}
      </Query>
    );
  }
}

export default Order;
