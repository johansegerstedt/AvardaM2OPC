<?php

namespace Digia\AvardaCheckout\Block;

use \Magento\Framework\View\Element\Template;
use \Magento\Framework\View\Element\Template\Context;


class Checkout extends Template {

  private $devMode = true;

  /**
   * @param Context               $context               [description]
   * @param PostCollectionFactory $postCollectionFactory [description]
   * @param array                 $data                  [description]
   */
  public function __construct(
    Context $context,
    array $data = []
  ) {
    parent::__construct($context, $data);
  }

  public function getIsDevMode() {
    return $this->devMode;
  }
}
