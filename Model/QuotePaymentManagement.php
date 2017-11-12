<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface;
use Magento\Payment\Model\InfoInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class QuotePaymentManagement implements QuotePaymentManagementInterface
{
    /**
     * @var \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory
     */
    public $paymentDetailsFactory;

    /**
     * @var \Magento\Payment\Gateway\Command\CommandPoolInterface
     */
    public $commandPool;

    /**
     * @var \Magento\Payment\Gateway\Data\PaymentDataObjectInterfaceFactory
     */
    public $paymentDataObjectFactory;

    /**
     * @var \Magento\Quote\Api\CartRepositoryInterface
     */
    public $quoteRepository;

    /**
     * @var string
     */
    public $defaultMethod;

    /**
     * @var
     */
    protected $quote;

    /**
     * GuestPaymentManagement constructor.
     *
     * @param \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory $paymentDetailsFactory
     * @param \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool
     * @param \Magento\Payment\Gateway\Data\PaymentDataObjectInterfaceFactory $paymentDataObjectFactory
     * @param \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
     */
    public function __construct(
        \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory $paymentDetailsFactory,
        \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool,
        \Magento\Payment\Gateway\Data\PaymentDataObjectFactoryInterface $paymentDataObjectFactory,
        \Magento\Quote\Api\CartRepositoryInterface $quoteRepository,
        $defaultMethod = 'avarda_checkout'
    ) {
        $this->paymentDetailsFactory = $paymentDetailsFactory;
        $this->commandPool = $commandPool;
        $this->paymentDataObjectFactory = $paymentDataObjectFactory;
        $this->quoteRepository = $quoteRepository;
        $this->defaultMethod = $defaultMethod;
    }

    /**
     * {@inheritdoc}
     */
    public function getPurchaseId($cartId)
    {
        $quote = $this->quoteRepository->get($cartId);
        $payment = $quote->getPayment();
        $additionalInformation = $payment->getAdditionalInformation();
        if (!array_key_exists(PaymentDetailsInterface::PURCHASE_ID, $additionalInformation)) {
            if ($this->commandPool === null) {
                throw new \DomainException('Command pool is not configured for use.');
            }

            // Execute InitializePurchase command
            $arguments = $this->getCommandArguments($quote);
            $this->commandPool->get('avarda_initialize_payment')->execute($arguments);

            // Save payment data to quote
            $payment->setMethod($this->defaultMethod);
            $quote->save();

            // Get purchase ID from payment additional information
            $additionalInformation = $payment->getAdditionalInformation();
        } else {
            $this->updateItems($quote);
        }

        // Create payment details object
        $paymentDetails = $this->paymentDetailsFactory->create();
        $paymentDetails->setPurchaseId(
            $additionalInformation[PaymentDetailsInterface::PURCHASE_ID]
        );

        return $paymentDetails;
    }

    /**
     * @param \Magento\Quote\Api\Data\CartInterface $quote
     */
    public function updateItems(\Magento\Quote\Api\Data\CartInterface $quote)
    {
        if ($this->commandPool === null) {
            throw new \DomainException('Command pool is not configured for use.');
        }

        // Execute InitializePurchase command
        $arguments = $this->getCommandArguments($quote);
        $this->commandPool->get('avarda_update_items')->execute($arguments);
    }

    /**
     * Prepare arguments for InitializePayment command
     *
     * @param $cartId
     * @return array
     */
    protected function getCommandArguments($quote)
    {
        $arguments['amount'] = $quote->getGrandTotal();

        /** @var InfoInterface|null $payment */
        $payment = $quote->getPayment();
        if ($payment !== null && $payment instanceof InfoInterface) {
            $arguments['payment'] = $this->paymentDataObjectFactory
                ->create($payment);
        }

        return $arguments;
    }
}
