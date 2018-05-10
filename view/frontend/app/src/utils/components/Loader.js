// @flow
import React, {Component} from 'react';
import type {Node} from 'react';

type Props = {
  isLoading: boolean,
  children: null | Node,
  block: boolean,
};

const RealLoader = () => (
  <div className="loading">
    <div className="loading-bar" />
    <div className="loading-bar" />
    <div className="loading-bar" />
    <div className="loading-bar" />
  </div>
);

class Loader extends Component<Props> {
  render() {
    const {isLoading, children} = this.props;
    return isLoading ? <RealLoader /> : children;
  }
}

export default Loader;
