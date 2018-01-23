<?php
/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Digia\AvardaCheckout\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

/**
 * Class AutomaticInvoicing
 */
class AutomaticInvoicing implements ObserverInterface
{
    /**
     * @var \Psr\Log\LoggerInterface $logger
     */
    protected $logger;

    /**
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    private $paymentDataHelper;

    /**
     * @var \Magento\Sales\Api\InvoiceManagementInterface
     */
    private $invoiceService;

    /**
     * @var \Magento\Framework\DB\TransactionFactory
     */
    private $transactionFactory;

    /**
     * AutomaticInvoicing constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     * @param \Magento\Sales\Api\InvoiceManagementInterface $invoiceService
     * @param \Magento\Framework\DB\TransactionFactory $transactionFactory
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper,
        \Magento\Sales\Api\InvoiceManagementInterface $invoiceService,
        \Magento\Framework\DB\TransactionFactory $transactionFactory
    ) {
        $this->logger = $logger;
        $this->paymentDataHelper = $paymentDataHelper;
        $this->invoiceService = $invoiceService;
        $this->transactionFactory = $transactionFactory;
    }

    /**
     * @param Observer $observer
     * @return void
     */
    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        try {
            $order = $observer->getEvent()->getOrder();
            $payment = $order->getPayment();
            if ($this->paymentDataHelper->isAvardaPayment($payment)) {
                $invoice = $this->invoiceService->prepareInvoice($order);
                $invoice->setRequestedCaptureCase($invoice::CAPTURE_ONLINE);
                $invoice->register();
                $invoice->save();
                $order->save();
            }
        } catch (\Exception $e) {
            $this->logger->error($e);
        }
    }
}