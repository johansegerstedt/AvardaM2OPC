// @flow
import React from 'react';
import {type CartItem} from '$src/cart/types';
import {$} from '$i18n';
import {formatCurrency} from '$src/utils/format';
import {getConfig} from '$src/config';

const getSrcFallbackHandler = (uri: string) => (ev: SyntheticEvent<>): void => {
  if (ev.target instanceof HTMLImageElement) {
    ev.target.src = uri;
  }
};

const ProductItem = ({
  currency,
  deleteItem,
  item: {
    name,
    item_id,
    price_incl_tax,
    qty,
    isDeleting,
    product_url,
    image_url,
  },
}: {
  currency: string,
  deleteItem: EventHandler,
  item: CartItem,
}) => {
  const {productPlaceholderImage} = getConfig();
  return (
    <div className="product-container">
      <span className="product-image-container">
        <span className="product-image-wrapper" style={{paddingBottom: '100%'}}>
          <img
            className="product-image-photo"
            src={image_url || productPlaceholderImage}
            onError={getSrcFallbackHandler(productPlaceholderImage)}
            width={90}
            height={90}
            alt={name}
          />
        </span>
      </span>
      <div className="product-info product-row">
        <div>
          <a href={product_url} target="_blank">
            <span>{name}</span>
          </a>
        </div>
        <div className="control qty">
          {/* <i className="material-icons md-18">add</i> */}
          <input
            id={`cart-${item_id}-qty`}
            name={`cart[${item_id}][qty]`} // Used to get updated quantities!
            defaultValue={qty}
            type="number"
            size={4}
            title="Qty"
            min="0"
            className="input-text avarda-input-qty"
          />
          {/* <i className="material-icons md-18">remove</i> */}
        </div>
      </div>
      <div className="product-subtotal product-row">
        <div>
          <span>{formatCurrency(price_incl_tax * qty, currency)}</span>
        </div>
        <div>
          <button
            title={$.mage.__('Remove item')}
            className="avarda-action-delete"
            onClick={deleteItem}
            disabled={isDeleting}
            type="button"
          >
            <i data-itemid={item_id} className="material-icons md-18">
              remove_circle
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
