// @flow
import React, {Component} from 'react';
import type {Node} from 'react';

type Props = {
  isLoading: boolean,
  children: null | Node,
  height?: number,
  center?: boolean,
};

const RealLoader = (props: {height?: number}) => (
  <div className="loading-wrapper" style={{height: props.height}}>
    <div className="loading">
      <div className="loading-bar" />
      <div className="loading-bar" />
      <div className="loading-bar" />
      <div className="loading-bar" />
    </div>
  </div>
);

class Loader extends Component<Props> {
  render() {
    const {isLoading, children, height} = this.props;
    return isLoading ? <RealLoader height={height} /> : children;
  }
}

export default Loader;
