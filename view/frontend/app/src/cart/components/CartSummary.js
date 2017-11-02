// @flow
import React from 'react';
import {initial, last} from 'lodash';
import {formatCurrency} from '$src/utils/format';
import Loader from '$src/utils/components/Loader';
import type {TotalSegment} from '../types';
import type {Translate} from '$i18n';

type Props = {
  currency: string,
  isLoading: boolean,
  t: Translate,
  totalSegments: TotalSegment[],
};

class CartSummary extends React.Component<Props> {
  render() {
    const {currency, totalSegments, isLoading, t} = this.props;
    const segments = initial(totalSegments);
    const grandTotal = last(totalSegments);
    return (
      <div className="cart-summary" style={{top: 0}}>
        <strong className="summary title">{t('Summary')}</strong>
        <div id="cart-totals" className="cart-totals">
          <div className="table-wrapper" data-bind="blockLoader: isLoading">
            <Loader isLoading={isLoading}>
              <table className="data table totals">
                <caption className="table-caption">{t('Total')}</caption>
                <tbody>
                  {segments.map(({code, title, value}) => (
                    <tr key={code} className="totals sub">
                      <th className="mark" scope="row">
                        {title}
                      </th>
                      <td className="amount">
                        <span className="price" data-th={t('Subtotal')}>
                          {formatCurrency(value, currency)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  <tr key={grandTotal.code} className="grand totals">
                    <th className="mark" scope="row">
                      <strong>{grandTotal.title}</strong>
                    </th>
                    <td className="amount">
                      <strong>
                        <span className="price">
                          {formatCurrency(grandTotal.value, currency)}
                        </span>
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Loader>
          </div>
        </div>
      </div>
    );
  }
}

export default CartSummary;
