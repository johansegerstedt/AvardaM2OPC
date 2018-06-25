define([
  "jquery",
  "ko",
  "Magento_Checkout/js/model/quote",
  "Magento_Checkout/js/model/resource-url-manager",
  "mage/storage",
  "Magento_Checkout/js/model/payment-service",
  "Magento_Checkout/js/model/payment/method-converter",
  "Magento_Checkout/js/model/error-processor",
  "Magento_Checkout/js/action/select-billing-address"
], function(
  $,
  ko,
  quote,
  resourceUrlManager,
  storage,
  paymentService,
  methodConverter,
  errorProcessor,
  selectBillingAddressAction
) {
  "use strict";

  var mixin = {
    saveShippingInformation: function() {
      var payload;

      // Don't force billing address at this point
      /*if (!quote.billingAddress()) {
          selectBillingAddressAction(quote.shippingAddress());
      }*/

      payload = {
        addressInformation: {
          shipping_address: quote.shippingAddress(),
          // 'billing_address': quote.billingAddress(),
          shipping_method_code: quote.shippingMethod()["method_code"],
          shipping_carrier_code: quote.shippingMethod()["carrier_code"]
        }
      };

      return storage
        .post(
          resourceUrlManager.getUrlForSetShippingInformation(quote),
          JSON.stringify(payload)
        )
        .done(function(response) {
          quote.setTotals(response.totals);
          paymentService.setPaymentMethods(
            methodConverter(response["payment_methods"])
          );
        })
        .fail(function(response) {
          errorProcessor.process(response);
        });
    }
  };

  return function(shippingSaveProcessor) {
    return $.extend({}, shippingSaveProcessor, mixin);
  };
});
