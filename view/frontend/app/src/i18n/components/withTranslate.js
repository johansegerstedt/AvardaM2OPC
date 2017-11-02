// @flow
import React, {Component, type ComponentType} from 'react';
import {contextTypes} from './TranslateProvider';
import type {Translate, TranslateContext} from '../types';

type Props = Object;

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const withTranslate = (
  WrappedComponent: ComponentType<{t: Translate} & Props>,
) =>
  class WithTranslate extends Component<Props> {
    static contextTypes = contextTypes;

    static displayName = `WithTranslate(${getDisplayName(WrappedComponent)})`;

    render() {
      // eslint-disable-next-line no-unused-vars
      const {t: __dont_pass_through__, ...props} = this.props;
      if (typeof this.context.t !== 'function') {
        throw new Error(
          '`t` is missing from context. Did you remember to add TranslateProvider?',
        );
      }
      const {t}: TranslateContext = this.context;
      return <WrappedComponent t={t} {...props} />;
    }
  };

export default withTranslate;
