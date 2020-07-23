const { default: PleaseSignIn } = require('../components/PleaseSignIn');
import OrderList from '../components/OrderList';

const OrdersPage = (props) => (
  <PleaseSignIn>
    <OrderList />
  </PleaseSignIn>
);

export default OrdersPage;
