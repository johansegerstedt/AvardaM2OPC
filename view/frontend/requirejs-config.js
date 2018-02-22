var config = {
  paths: {
    avardaCheckout: 'Digia_AvardaCheckout/js/bundle',
  },
  config: {
    mixins: {
      'Magento_Checkout/js/model/shipping-save-processor': {
        'Digia_AvardaCheckout/js/model/shipping-save-processor-mixin': true
      }
    }
  }
};
