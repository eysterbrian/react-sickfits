import Item from '../components/Item';
import { shallow } from 'enzyme';

const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  priceCents: 5010,
  description: 'This is my fake test item',
  image: 'dog.jpg',
  largeImage: 'largeDog.jpg',
};

describe('Shallow testing of <Item />', () => {
  it('renders the img', () => {
    const itemWrapper = shallow(<Item item={fakeItem} />);
    const imgWrapper = itemWrapper.find('img');
    expect(imgWrapper.props().src).toBe(fakeItem.image);
    expect(imgWrapper.props().alt).toBe(fakeItem.title);
  });
  it('renders PriceTag and Title', () => {
    const itemWrapper = shallow(<Item item={fakeItem} />);
    // console.log(itemWrapper.debug());
    expect(itemWrapper.find('PriceTag').children().text()).toBe('$50.10');
    expect(itemWrapper.find('Title Link a').children().text()).toBe(
      fakeItem.title
    );
  });
  it('renders the buttons properly', () => {
    const itemWrapper = shallow(<Item item={fakeItem} />);
    const buttonList = itemWrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.children().first());

    // Several ways to test whether a child component exists...
    expect(buttonList.children().find('Link')).toBeTruthy();
    expect(buttonList.children().find('AddToCart').exists()).toBe(true);
    expect(buttonList.children().find('DeleteItem')).toHaveLength(1);
  });
});
