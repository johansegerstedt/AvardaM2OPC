<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Plugin\Model\Quote;

use \Magento\Quote\Api\Data\CartInterface;
use \Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;

class CollectTotals
{
    /**
     * @var \Psr\Log\LoggerInterface $logger
     */
    protected $logger;

    /**
     * @var QuotePaymentManagementInterface
     */
    protected $quotePaymentManagement;

    /**
     * @var \Digia\AvardaCheckout\Helper\Quote
     */
    protected $quoteHelper;

    /**
     * @var bool
     */
    protected $collectTotalsFlag = false;

    /**
     * CollectTotals constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param QuotePaymentManagementInterface $quotePaymentManagement
     * @param \Digia\AvardaCheckout\Helper\Quote $quoteHelper
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        QuotePaymentManagementInterface $quotePaymentManagement,
        \Digia\AvardaCheckout\Helper\Quote $quoteHelper
    ) {
        $this->logger = $logger;
        $this->quotePaymentManagement = $quotePaymentManagement;
        $this->quoteHelper = $quoteHelper;
    }

    /**
     * @param CartInterface $subject
     * @param CartInterface $result
     * @return CartInterface
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterCollectTotals(CartInterface $subject, CartInterface $result)
    {
        try {
            if (!$this->collectTotalsFlag &&
                $this->quoteHelper->getPurchaseId($subject)
            ) {
                $this->quotePaymentManagement->updateItems($subject);
                $this->collectTotalsFlag = true;
            }
        } catch (\Exception $e) {
            $this->logger->error($e);
        }

        return $result;
    }
}
