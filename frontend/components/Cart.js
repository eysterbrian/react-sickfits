import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import User from './User';
import CartItem from './CartItem';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';

const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`;

const Cart = (props) => {
  return (
    <User>
      {({ data: { me: user } }) => {
        if (!user) return null;
        return (
          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {(toggleCartMutation) => (
              <Query query={LOCAL_STATE_QUERY}>
                {({ data }) => (
                  <CartStyles open={data.cartOpen}>
                    <header>
                      <CloseButton title="close" onClick={toggleCartMutation}>
                        &times;
                      </CloseButton>
                      <Supreme>{user.name}'s Cart</Supreme>
                      <p>
                        You have {user.cart.length} item
                        {user.cart.length !== 1 && 's'} in your cart
                      </p>
                    </header>
                    <ul>
                      {user.cart.map((item) => (
                        <CartItem key={item.id} cartItem={item} />
                      ))}
                    </ul>
                    <footer>
                      <p>{formatMoney(calcTotalPrice(user.cart))}</p>
                      <SickButton>Checkout</SickButton>
                    </footer>
                  </CartStyles>
                )}
              </Query>
            )}
          </Mutation>
        );
      }}
    </User>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
