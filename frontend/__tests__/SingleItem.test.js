import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem';
import { fakeItem } from '../lib/testUtils';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

describe('<SingleItem />', () => {
  it('renders with proper data', async () => {
    // Create mock data that the apollo MockedProvider will return
    const mocks = [
      {
        // When someone makes a request with this query and variables
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        // Return this data
        result: { data: { item: fakeItem() } },
      },
    ];

    // Wrap our component in MockedProvider so we use mocked data from apollo
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    // On the initial mount, we should be in loading state
    expect(wrapper.text()).toContain('Loading');

    // Wait for the loading state to pass by awaiting a promise that resolves in 0ms
    //  (so that we are on the next event loop
    await wait();

    // Now force the component to update (and re-query apollo)
    wrapper.update();

    // We don't want to snapshot the entire wrapper, b/c we'll have tons of code for MockedProvider
    expect(toJSON(wrapper.find('h2'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('p'))).toMatchSnapshot();
    expect(toJSON(wrapper.find('img'))).toMatchSnapshot();
    // expect(toJSON(wrapper.find('SingleItem'))).toMatchSnapshot();
  });

  it('errors with a not found item', async () => {
    const mocks = [
      {
        // When someone makes a request with this query and variables
        request: { query: SINGLE_ITEM_QUERY, variables: { id: '123' } },
        // Return an error message
        result: { errors: [{ message: 'Item not found!!!!' }] },
      },
    ];
    // Wrap our component in MockedProvider so we use mocked data from apollo
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123" />
      </MockedProvider>
    );

    // Wait for the next event loop cycle, then re-query
    await wait();
    wrapper.update();

    // Now confirm that the component contains our error
    expect(
      toJSON(wrapper.find('[data-test="graphql-error"]'))
    ).toMatchSnapshot();
  });
});
