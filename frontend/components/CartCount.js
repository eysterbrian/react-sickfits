import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Dot = styled.div`
  background: ${(props) => props.theme.red};
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 100;
  font-family: arial;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`;

const AnimationStyles = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    backface-visibility: hidden;
    transition: all 0.4s;
  }
  .count-enter {
    transform: translateY(-2rem);
    opacity: 0;
  }
  .count-enter-active {
    transform: translateY(0px);
    opacity: 1;
  }
  .count-exit {
    top: 0;
    position: absolute;
    /* transform: rotateX(0); */
    transform: translateY(0px);
    opacity: 1;
  }
  .count-exit-active {
    /* transform: rotateX(0.5turn); */
    transform: translateY(2rem);
    opacity: 0;
  }
`;

const CartCount = ({ count }) => (
  <AnimationStyles>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        classNames="count"
        className="count"
        key={count}
        timeout={{ enter: 400, exit: 400 }}
      >
        <Dot>{count}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyles>
);
CartCount.propTypes = {
  count: PropTypes.number.isRequired,
};

export default CartCount;
