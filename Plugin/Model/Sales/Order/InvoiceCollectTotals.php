<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Plugin\Model\Sales\Order;

use Digia\AvardaCheckout\Api\ItemStorageInterface;
use Magento\Sales\Api\Data\InvoiceInterface;

class InvoiceCollectTotals
{
    /**
     * @var \Psr\Log\LoggerInterface $logger
     */
    protected $logger;

    /**
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelper;

    /**
     * @var ItemStorageInterface
     */
    protected $itemStorage;

    /**
     * @var bool
     */
    protected $collectTotalsFlag = false;

    /**
     * InvoiceCollectTotals constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     * @param ItemStorageInterface $itemStorage
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper,
        ItemStorageInterface $itemStorage
    ) {
        $this->logger = $logger;
        $this->paymentDataHelper = $paymentDataHelper;
        $this->itemStorage = $itemStorage;
    }

    /**
     * @param InvoiceInterface $subject
     * @param InvoiceInterface $result
     * @return InvoiceInterface
     */
    public function afterCollectTotals(
        InvoiceInterface $subject,
        InvoiceInterface $result
    ) {
        try {
            $payment = $subject->getOrder()->getPayment();
            if (!$this->collectTotalsFlag &&
                $this->paymentDataHelper->isAvardaPayment($payment)
            ) {
                $this->buildItemStorage($subject);
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
     * @param InvoiceInterface $subject
     */
    protected function buildItemStorage(InvoiceInterface $subject)
    {

    }
}
