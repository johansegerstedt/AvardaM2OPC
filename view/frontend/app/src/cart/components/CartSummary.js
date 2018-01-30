// @flow
import React from 'react';
import {$} from '$i18n';
import {formatCurrency} from '$src/utils/format';
import Loader from '$src/utils/components/Loader';
import type {TotalSegment} from '../types';

type Props = {
  currency: string,
  isLoading: boolean,
  totalSegments: TotalSegment[],
};

class CartSummary extends React.Component<Props> {
  render() {
    const {currency, totalSegments, isLoading} = this.props;
    const {segments, footerSegments} = totalSegments.reduce(
      (obj, segment) => {
        if (segment.area && segment.area === 'footer') {
          obj.footerSegments.push(segment);
        } else {
          obj.segments.push(segment);
        }
        return obj;
      },
      {segments: [], footerSegments: []},
    );
    return (
      <div className="cart-summary" style={{top: 0}}>
        <strong className="summary title">{$.mage.__('Summary')}</strong>
        <div id="cart-totals" className="cart-totals">
          <div className="table-wrapper">
            <Loader isLoading={isLoading} block>
              <table className="data table totals">
                <caption className="table-caption">
                  {$.mage.__('Total')}
                </caption>
                <tbody>
                  {segments.map(
                    ({code, title, value}) =>
                      value !== null ? (
                        <tr key={code} className="totals sub">
                          <th className="mark" scope="row">
                            {$.mage.__(title)}
                          </th>
                          <td className="amount">
                            <span
                              className="price"
                              data-th={$.mage.__('Subtotal')}
                            >
                              {formatCurrency(value, currency)}
                            </span>
                          </td>
                        </tr>
                      ) : null,
                  )}
                  {footerSegments.map(
                    ({code, title, value}) =>
                      value !== null ? (
                        <tr key={code} className="grand totals">
                          <th className="mark" scope="row">
                            <strong>{$.mage.__(title)}</strong>
                          </th>
                          <td className="amount">
                            <strong>
                              <span className="price">
                                {formatCurrency(value, currency)}
                              </span>
                            </strong>
                          </td>
                        </tr>
                      ) : null,
                  )}
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
