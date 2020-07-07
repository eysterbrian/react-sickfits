export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.item) return tally; // In case item has been deleted
    return tally + cartItem.quantity * cartItem.item.priceCents;
  }, 0);
}
