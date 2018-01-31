// @flow
import React from 'react';
import {$} from '$i18n';
import {formatCurrency} from '$src/utils/format';
import Loader from '$src/utils/components/Loader';
import type {Cart, TotalSegment} from '../types';

type Props = {
  currency: string,
  isLoading: boolean,
  totalSegments: TotalSegment[],
  cart: Cart,
};

/**
 * Choose and display correct value in the correct format.
 * Basically workaround for https://github.com/magento/magento2/issues/13392
 * @param  {Object}  totalSegment
 * @param  {Object}  totalsData
 * @param  {string}  currency
 * @return {string}
 */
const displayTotalSegmentValue = (
  {code, value}: TotalSegment,
  totalsData: Cart,
  currency: string,
): string => {
  let theValue = '';
  switch (code) {
    case 'shipping': {
      theValue = window.checkoutConfig.isDisplayShippingPriceExclTax
        ? totalsData.shipping_amount
        : totalsData.shipping_incl_tax;
      break;
    }
    default:
      theValue = value;
  }
  return formatCurrency(theValue, currency);
};

class CartSummary extends React.Component<Props> {
  render() {
    const {currency, totalSegments, isLoading, cart: totalsData} = this.props;
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
                              {displayTotalSegmentValue(
                                {code, value, title},
                                totalsData,
                                currency,
                              )}
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
                                {displayTotalSegmentValue(
                                  {code, value, title},
                                  totalsData,
                                  currency,
                                )}
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
