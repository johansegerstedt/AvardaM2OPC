// @flow
import React, {Component} from 'react';
import type {Node} from 'react';

type RealLoaderProps = {
  height: number,
};
type Props = {
  show: boolean,
  type?: string,
  children: null | Node,
  height: number,
  center?: boolean,
};

const Bars = ({height}: RealLoaderProps) => (
  <div className="loading-wrapper" style={{height}}>
    <div className="loading">
      <div className="loading-bar" />
      <div className="loading-bar" />
      <div className="loading-bar" />
      <div className="loading-bar" />
    </div>
  </div>
);

const Circular = ({height}: RealLoaderProps) => (
  <div className="loading-wrapper" style={{height}}>
    <div className="loader">
      <svg className="circular" viewBox="25 25 50 50">
        <circle
          className="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  </div>
);

class Loader extends Component<Props> {
  render() {
    const {show, children, height, type} = this.props;
    if (!show) return children;
    switch (type) {
      default:
      case 'bars':
        return <Bars height={height} />;
      case 'circular':
        return <Circular height={height} />;
    }
  }
}

export default Loader;
