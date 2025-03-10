import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import User from './User';
import CartItem from './CartItem';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import TakeMyMoney from './TakeMyMoney';

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

// Use react-adopt to compose several queries/mutations at once
const Composed = adopt({
  // Each of our components uses children as the render prop, so to avoid proptype errors
  // we explicitly pass the render as the children prop
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = (props) => {
  return (
    <Composed>
      {({ user, toggleCart, localState }) => {
        const me = user.data.me;
        if (!me) return null;
        return (
          <CartStyles open={localState.data.cartOpen}>
            <header>
              <CloseButton title="close" onClick={toggleCart}>
                &times;
              </CloseButton>
              <Supreme>{me.name}'s Cart</Supreme>
              <p>
                You have {me.cart.length} item
                {me.cart.length !== 1 && 's'} in your cart
              </p>
            </header>
            <ul>
              {me.cart.map((item) => (
                <CartItem key={item.id} cartItem={item} />
              ))}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              {me.cart.length ? (
                <TakeMyMoney>
                  <SickButton>Checkout</SickButton>
                </TakeMyMoney>
              ) : null}
            </footer>
          </CartStyles>
        );
      }}
    </Composed>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
