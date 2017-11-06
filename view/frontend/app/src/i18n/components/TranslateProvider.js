// @flow
import {Component, Children, type ComponentType, type Node} from 'react';
import sanitizeHtml from 'sanitize-html';

import propTypes from 'prop-types';
import type {
  MageTranslate,
  Translate,
  TranslateContext,
  TranslateHTML,
} from '../types';

type Props = {
  children: Node | ComponentType<any>,
  mageTranslate: MageTranslate,
};

export const contextTypes = {
  t: propTypes.func,
  tHTML: propTypes.func,
};

class TranslateProvider extends Component<Props> {
  static childContextTypes = contextTypes;

  translate: Translate = (str, ...variables) => {
    const {mageTranslate} = this.props;
    return sanitizeHtml(
      variables.reduce(
        (translated: string, variable, index: number) =>
          translated.replace(`%${index + 1}`, variable),
        mageTranslate(str),
      ),
    );
  };

  translateHTML: TranslateHTML = (str, ...variables) => ({
    __html: this.translate(str, ...variables),
  });

  getChildContext = (): TranslateContext => ({
    t: this.translate,
    tHTML: this.translateHTML,
  });

  render() {
    const {children} = this.props;
    return Children.only(children);
  }
}

export default TranslateProvider;
