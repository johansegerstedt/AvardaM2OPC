<?php

namespace Digia\AvardaCheckout\Controller\Index;

use \Magento\Framework\App\Action\Action;
use \Magento\Framework\View\Result\PageFactory;
use \Magento\Framework\View\Result\Page;
use \Magento\Framework\App\Action\Context;


class Index extends Action {
  /**
   * @var PageFactory
   */
  protected $resultPageFactory;
  /**
   * @param Context     $context           [description]
   * @param PageFactory $resultPageFactory [description]
   */
  public function __construct(Context $context, PageFactory $resultPageFactory) {
    parent::__construct($context);
    $this->resultPageFactory = $resultPageFactory;
  }

  /**
   * @return  Page [description]
   * @throws  LocalizedException [<description>]
   */
  public function execute() {
    $resultPage = $this->resultPageFactory->create();
    $resultPage->getLayout()->getUpdate()->addHandle('avardacheckout_layout');
    return $resultPage;
  }
}
