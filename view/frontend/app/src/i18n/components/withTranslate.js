// @flow
import React, {Component, type ComponentType} from 'react';
import {contextTypes} from './TranslateProvider';
import type {TranslateContext} from '../types';

type Props = Object;

const MISSING_CONTEXT =
  ' is missing from the context. Did you remember to add TranslateProvider?';

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const withTranslate = (WrappedComponent: ComponentType<Props>) => {
  return class WithTranslate extends Component<Props> {
    static contextTypes = contextTypes;

    static displayName = `WithTranslate(${getDisplayName(WrappedComponent)})`;

    render() {
      const {
        /* eslint-disable no-unused-vars */
        t: __dont_pass_through_t__,
        tHTML: __dont_pass_through_tHTML__,
        /* eslint-enable no-unused-vars */
        ...props
      } = this.props;

      const tIsMissing = typeof this.context.t !== 'function';
      const tHTMLIsMissing = typeof this.context.tHTML !== 'function';
      if (tIsMissing || tHTMLIsMissing) {
        const errorMessage = [
          tIsMissing ? `t${MISSING_CONTEXT}` : '',
          tHTMLIsMissing ? `tHTML${MISSING_CONTEXT}` : '',
        ]
          .filter(Boolean)
          .join('\n');
        throw new Error(errorMessage);
      }
      const {t, tHTML}: TranslateContext = this.context;
      return <WrappedComponent t={t} tHTML={tHTML} {...props} />;
    }
  };
};

export default withTranslate;
