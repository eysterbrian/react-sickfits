import Items from '../components/Items';

const Home = (props) => (
  <div>
    <Items page={Number(props.query.page) || 1} />
  </div>
);

export default Home;
