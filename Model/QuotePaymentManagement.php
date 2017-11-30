<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface;
use Magento\Framework\Exception\PaymentException;
use Magento\Payment\Model\InfoInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class QuotePaymentManagement implements QuotePaymentManagementInterface
{
    /**
     * @var \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory
     */
    protected $paymentDetailsFactory;

    /**
     * @var \Magento\Payment\Gateway\Command\CommandPoolInterface
     */
    protected $commandPool;

    /**
     * @var \Magento\Payment\Gateway\Data\PaymentDataObjectInterfaceFactory
     */
    protected $paymentDataObjectFactory;

    /**
     * @var \Magento\Quote\Api\CartRepositoryInterface
     */
    protected $quoteRepository;

    /**
     * @var string
     */
    protected $defaultMethod;

    /**
     * @var
     */
    protected $quote;

    /**
     * GuestPaymentManagement constructor.
     *
     * @param \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory $paymentDetailsFactory
     * @param \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Payment\Gateway\Data\PaymentDataObjectInterfaceFactory $paymentDataObjectFactory
     * @param \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
     * @param string $defaultMethod
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
        if (!is_array($additionalInformation) ||
            !array_key_exists(PaymentDetailsInterface::PURCHASE_ID, $additionalInformation)
        ) {
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
     * {@inheritdoc}
     */
    public function freezeCart($cartId)
    {
        $quote = $this->quoteRepository->get($cartId);
        $payment = $quote->getPayment();
        $additionalInformation = $payment->getAdditionalInformation();
        if (!is_array($additionalInformation) ||
            !array_key_exists(PaymentDetailsInterface::PURCHASE_ID, $additionalInformation)
        ) {
            throw new PaymentException(__('No purchase ID on quote %s.', $cartId));
        }

        $quote->setIsActive(false);
        $quote->save();
    }

    /**
     * {@inheritdoc}
     */
    public function updatePaymentStatus($cartId)
    {
        $quote = $this->quoteRepository->get($cartId);
        $payment = $quote->getPayment();
        $additionalInformation = $payment->getAdditionalInformation();
        if (!is_array($additionalInformation) ||
            !array_key_exists(PaymentDetailsInterface::PURCHASE_ID, $additionalInformation)
        ) {
            throw new PaymentException(__('No purchase ID on quote %s.', $cartId));
        }
        if ($this->commandPool === null) {
            throw new \DomainException('Command pool is not configured for use.');
        }

        // Execute InitializePurchase command
        $arguments = $this->getCommandArguments($quote);
        $this->commandPool->get('avarda_get_payment_status')->execute($arguments);

        // Unfreeze cart before placing order
        $quote->setIsActive(true);

        // Save updated quote
        $quote->save();
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
