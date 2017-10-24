<?php

namespace Digia\AvardaCheckout\Block;

use \Magento\Framework\View\Element\Template;
use \Magento\Framework\View\Element\Template\Context;


class Checkout extends Template {

  private $devMode = true;
  private $checkoutSession;
  private $quoteIdMaskFactory;

  /**
   * @param Context               $context               [description]
   * @param PostCollectionFactory $postCollectionFactory [description]
   * @param array                 $data                  [description]
   */
  public function __construct(
    Context $context,
    \Magento\Checkout\Model\Session $checkoutSession,
    \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory,
    array $data = []
  ) {
    parent::__construct($context, $data);
    $this->checkoutSession = $checkoutSession;
    $this->quoteIdMaskFactory = $quoteIdMaskFactory;  
  }

  public function getIsDevMode() {
    return $this->devMode;
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
}
