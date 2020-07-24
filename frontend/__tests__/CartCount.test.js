import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';

import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  it('renders', () => {
    // Note that failed propTypes will trigger a test failure
    shallow(<CartCount count={3} />);
    // No expect() is needed, since any errors from the render will trigger fail
  });
  it('matches the snapshot', () => {
    expect(toJSON(shallow(<CartCount count={10} />))).toMatchSnapshot();
  });
  it('updates via props', () => {
    const wrapper = shallow(<CartCount count={17} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.setProps({ count: 3 });
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
