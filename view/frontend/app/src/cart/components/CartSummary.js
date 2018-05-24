// @flow
import React, {Component} from 'react';
import {$} from '$i18n';
import {formatCurrency} from '$src/utils/format';
import type {Cart, TotalSegment} from '../types';
import Loader from '$src/utils/components/Loader/Loader';

type Props = {
  currency: string,
  isUpdating: boolean,
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

class CartSummary extends Component<Props> {
  render() {
    const {currency, totalSegments, isUpdating, cart: totalsData} = this.props;
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
      <Loader show={isUpdating} height={150}>
        <div className="avarda-cart-summary cart-summary">
          <div id="cart-totals" className="avarda-cart-totals cart-totals">
            <div className="table-wrapper">
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
                            <span className="price">
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
            </div>
          </div>
        </div>
      </Loader>
    );
  }
}

export default CartSummary;
