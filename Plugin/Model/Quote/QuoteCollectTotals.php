<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Plugin\Model\Quote;

use Magento\Quote\Api\Data\CartInterface;
use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;

class QuoteCollectTotals
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
     * @var array
     */
    protected $builder;

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
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper,
        $builder = null
    ) {
        $this->logger = $logger;
        $this->quotePaymentManagement = $quotePaymentManagement;
        $this->paymentDataHelper = $paymentDataHelper;
        $this->builder = $builder;
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
                $this->buildItemStorage($subject);
                $this->quotePaymentManagement->updateItems($subject);
                $this->collectTotalsFlag = true;
            }
        } catch (\Exception $e) {
            $this->logger->error($e);
        }

        return $result;
    }

    /**
     * Populate the item storage with Avarda items needed for request building
     *
     * @param CartInterface $subject
     */
    protected function buildItemStorage(CartInterface $subject)
    {
        $this->buildItems($subject);
    }

    /**
     * Populate the item storage with Avarda items needed for request building
     *
     * @param CartInterface $subject
     */
    protected function buildItems(CartInterface $subject)
    {
        foreach ($subject->getItems() as $item) {
            if (!$item->getProductId() ||
                $item->hasParentItemId() ||
                $item->isDeleted()
            ) {
                continue;
            }


            /*$itemSubject['item'] = $itemDO;
            $itemSubject['amount'] = $this->formatPrice(
                $item->getRowTotalInclTax() - $item->getDiscountAmount()
            );
            $itemSubject['tax_amount'] = $this->formatPrice(
                $item->getTaxAmount()
                + $item->getHiddenTaxAmount()
                + $item->getWeeeTaxAppliedAmount()
            );*/
        }
    }
}
