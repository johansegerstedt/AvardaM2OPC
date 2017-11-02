// @flow
import React from 'react';
import CartContainer from '$src/cart/components/CartContainer';
import {withTranslate, type Translate} from '$i18n';

type Props = {
  t: Translate,
};

const App = ({t}: Props) => (
  <div className="app">
    <h1>{t('Checkout')}</h1>
    <CartContainer />
  </div>
);

export default withTranslate(App);
