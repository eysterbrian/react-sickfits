import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';
import { STORE_NAME } from '../config';

function totalItems(cart) {
  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
}

class TakeMyMoney extends React.Component {
  onToken = (res) => {
    console.log('onToken called...', res.id);
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            name={STORE_NAME}
            description={`Order of ${totalItems(me.cart)} items`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey="pk_test_51H2m1BBtyuoRneQFdQUsTEJKESJaKaYU3wMpDuOOQyEa6dS86TsAg24VNcJNiWHBKGdKOidJT4IiMFlye3lknYKK00z4M59Y6Q"
            currency="USD"
            email={me.email}
            token={(res) => this.onToken(res)}
          >
            {this.props.children}
          </StripeCheckout>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
