<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Controller\Checkout;

use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Digia\AvardaCheckout\Controller\AbstractCheckout;

class Process extends AbstractCheckout
{
    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * @var QuotePaymentManagementInterface
     */
    protected $quotePaymentManagement;

    /**
     * Process constructor.
     *
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Digia\AvardaCheckout\Gateway\Config\Config $config
     * @param \Magento\Framework\View\Result\PageFactory $resultPageFactory
     * @param QuotePaymentManagementInterface $quotePaymentManagement
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Psr\Log\LoggerInterface $logger,
        \Digia\AvardaCheckout\Gateway\Config\Config $config,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        QuotePaymentManagementInterface $quotePaymentManagement
    ) {
        parent::__construct($context, $logger, $config);
        $this->resultPageFactory = $resultPageFactory;
        $this->quotePaymentManagement = $quotePaymentManagement;
    }

    /**
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        if (!$this->isCallback()) {
            // Show no route if Avarda is inactive and notify webmaster in logs.
            if (!$this->config->isActive()) {
                return $this->noroute('/checkout/avarda/process');
            }
        }

        if (($purchaseId = $this->getPurchaseId()) !== null) {
            return $this->resultPageFactory->create();
        }

        return $this->resultRedirectFactory
            ->create()->setPath('avarda/checkout');
    }
}
