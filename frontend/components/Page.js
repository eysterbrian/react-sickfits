import React from 'react';
import Header from './Header';
import Meta from './Meta';
import styled from 'styled-components';

const MyButton = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palegoldenrod;
  margin: 0 1em;
  padding: 0.25em 1em;
  font-size: ${props => (props.huge ? props.huge + 'px' : '1px')};
  .poop {
    font-size: 10px;
  }
`;

class Page extends React.Component {
  render() {
    return (
      <div>
        <Meta />
        <Header />
        <MyButton huge="10">
          Click me!
          <span className="poop">💩</span>
        </MyButton>
        {this.props.children}
      </div>
    );
  }
}

export default Page;
