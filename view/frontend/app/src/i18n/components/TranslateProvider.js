// @flow
import $ from 'jquery';
import _mageTranslate from 'mage/translate'; // eslint-disable-line no-unused-vars
import {Component, Children, type ComponentType, type Node} from 'react';
import sanitizeHtml from 'sanitize-html';
import propTypes from 'prop-types';
import type {Translate, TranslateContext, TranslateHTML} from '../types';

type Props = {
  children: Node | ComponentType<any>,
};

export const contextTypes = {
  t: propTypes.func,
  tHTML: propTypes.func,
};

const mageTranslate = $.mage.__;

class TranslateProvider extends Component<Props> {
  static childContextTypes = contextTypes;

  translate: Translate = (str, ...variables) => {
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
