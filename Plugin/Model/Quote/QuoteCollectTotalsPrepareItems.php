<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Plugin\Model\Quote;

use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Magento\Quote\Api\Data\CartInterface;

class QuoteCollectTotalsPrepareItems
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
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelper;

    /**
     * @var bool
     */
    protected $collectTotalsFlag = false;

    /**
     * QuoteCollectTotals constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param QuotePaymentManagementInterface $quotePaymentManagement
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        QuotePaymentManagementInterface $quotePaymentManagement,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper

    ) {
        $this->logger = $logger;
        $this->quotePaymentManagement = $quotePaymentManagement;
        $this->paymentDataHelper = $paymentDataHelper;
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
            $payment = $subject->getPayment();
            if (!$this->collectTotalsFlag &&
                $this->paymentDataHelper->isAvardaPayment($payment)
            ) {
                $this->quotePaymentManagement->prepareItemStorage($subject);
                $this->collectTotalsFlag = true;
            }
        } catch (\Exception $e) {
            $this->logger->error($e);
        }

        return $result;
    }
}
