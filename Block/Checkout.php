<?php

namespace Digia\AvardaCheckout\Block;

use \Magento\Framework\View\Element\Template;
use \Magento\Framework\View\Element\Template\Context;
use \Digia\AvardaCheckout\Gateway\Config\Config;


class Checkout extends Template {

  private $checkoutSession;
  private $quoteIdMaskFactory;
  private $config;

  /**
   * @param Context               $context               [description]
   * @param PostCollectionFactory $postCollectionFactory [description]
   * @param array                 $data                  [description]
   */
  public function __construct(
    Context $context,
    \Magento\Checkout\Model\Session $checkoutSession,
    \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory,
    Config $config,
    array $data = []
  ) {
    parent::__construct($context, $data);
    $this->checkoutSession = $checkoutSession;
    $this->quoteIdMaskFactory = $quoteIdMaskFactory;
    $this->config = $config;
  }

  public function getBaseMediaUrl() {
    return $this->_storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA );
  }

  public function getMaskedQuoteId() {
    return $this->quoteIdMaskFactory->create()->load(
      $this->checkoutSession->getQuote()->getId(),
      'quote_id'
      )->getMaskedId();
  }

  public function getCustomerId() {
    return $this->checkoutSession->getQuote()->getCustomerId();
  }

  public function getQuoteId() {
    return $this->checkoutSession->getQuote()->getId();
  }

  public function getItems() {
    $items = $this->checkoutSession->getQuote()->getAllVisibleItems();
    $data = [];

    foreach($items as $key => $item) {
      $itemData = [
        'qty' => $item->getQty(),
        'name' => $item->getName(),
        'price' => $item->getPrice(),
        'sku' => $item->getSku(),
        'total' => $item->getBaseRowTotalInclTax(),
        'url' => $item->getRedirectUrl(),
        'priceInclTax' => $item->getBasePriceInclTax()
      ];
      $data[] = $itemData;
    }

    return $data;
  }

  public function hasItems() {
    return $this->checkoutSession->getQuote()->hasItems();
  }

  /**
   * @return string
   */
  public function getCountryId() {
    // TODO;
    return 'FI';
  }

  /**
   * Get AvardaCheckOutClient script path for Require.js.
   * @return string
   */
  public function getCheckOutClientScriptPath() {
    return $this->config->getApplicationUrl() . '/Scripts/CheckOutClient';
  }
}
