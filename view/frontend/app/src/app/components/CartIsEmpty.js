// @flow
import React from 'react';
import {withTranslate} from '$i18n';
import {getConfig} from '$src/config';
import type {Translate, TranslateHTML} from '$i18n';

type Props = {
  t: Translate,
  tHTML: TranslateHTML,
};

const CartIsEmpty = ({t, tHTML}: Props) => (
  <div className="cart-empty">
    <p>{t('You have no items in your shopping cart.')}</p>
    <p
      dangerouslySetInnerHTML={tHTML(
        'Click <a href="%1">here</a> to continue shopping.',
        getConfig().baseUrl,
      )}
    />
  </div>
);

export default withTranslate(CartIsEmpty);
