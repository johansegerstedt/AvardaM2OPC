// @flow
import {Component, Children, type ComponentType, type Node} from 'react';
import propTypes from 'prop-types';
import type {Translate} from '../types';

type Props = {
  children: Node | ComponentType<any>,
  t: Translate,
};

export const contextTypes = {
  t: propTypes.func,
};

class TranslateProvider extends Component<Props> {
  static childContextTypes = contextTypes;

  getChildContext() {
    const {t} = this.props;
    return {t};
  }

  render() {
    const {children} = this.props;
    return Children.only(children);
  }
}

export default TranslateProvider;
