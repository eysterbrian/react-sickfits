import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import RemoveFromCart from './RemoveFromCart';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  p,
  h3 {
    margin: 0;
  }
`;

const CartItem = ({ cartItem }) => (
  <CartItemStyles>
    <img src={cartItem.item.image} height="100px" alt={cartItem.item.title} />
    <div className="cart-item-details">
      <h3>{cartItem.item.title}</h3>
      <p>
        {formatMoney(cartItem.item.priceCents * cartItem.quantity)}
        {<> &mdash; </>}
        {cartItem.quantity} &times; {formatMoney(cartItem.item.priceCents)} each
      </p>
    </div>
    <RemoveFromCart itemId={cartItem.id} />
  </CartItemStyles>
);

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
};
export default CartItem;
