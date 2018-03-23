<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
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
     * @var \Digia\AvardaCheckout\Gateway\Config\Config
     */
    protected $config;

    /**
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelper;

    /**
     * @var \Magento\Sales\Api\InvoiceManagementInterface|\Magento\Sales\Model\Service\InvoiceService
     */
    protected $invoiceService;

    /**
     * @var \Magento\Framework\DB\TransactionFactory
     */
    protected $transactionFactory;

    /**
     * AutomaticInvoicing constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Digia\AvardaCheckout\Gateway\Config\Config $config
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     * @param \Magento\Sales\Api\InvoiceManagementInterface $invoiceService
     * @param \Magento\Framework\DB\TransactionFactory $transactionFactory
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Digia\AvardaCheckout\Gateway\Config\Config $config,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper,
        \Magento\Sales\Api\InvoiceManagementInterface $invoiceService,
        \Magento\Framework\DB\TransactionFactory $transactionFactory
    ) {
        $this->logger = $logger;
        $this->config = $config;
        $this->paymentDataHelper = $paymentDataHelper;
        $this->invoiceService = $invoiceService;
        $this->transactionFactory = $transactionFactory;
    }

    /**
     * @param Observer $observer
     * @return void
     */
    public function execute(Observer $observer)
    {
        try {
            $order = $observer->getEvent()->getData('order');
            $payment = $order->getPayment();
            if ($this->paymentDataHelper->isAvardaPayment($payment) &&
                $this->config->isAutomaticInvoicingActive()
            ) {
                $invoice = $this->invoiceService->prepareInvoice($order);
                $invoice->getData('requested_capture_case', $invoice::CAPTURE_ONLINE);
                $invoice->register();
                $invoice->save();
                $order->save();
            }
        } catch (\Exception $e) {
            $this->logger->error($e);
        }
    }
}
