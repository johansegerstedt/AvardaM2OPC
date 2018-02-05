<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\ItemStorageInterface;
use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Magento\Framework\Exception\PaymentException;
use Magento\Payment\Gateway\Data\PaymentDataObjectFactoryInterface;
use Magento\Payment\Model\InfoInterface;
use Magento\Quote\Api\Data\CartInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class QuotePaymentManagement implements QuotePaymentManagementInterface
{
    /**
     * @var \Digia\AvardaCheckout\Api\ItemManagementInterface $itemManagement
     */
    protected $itemManagement;

    /**
     * @var ItemStorageInterface $itemStorage
     */
    protected $itemStorage;

    /**
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelper;

    /**
     * @var \Magento\Payment\Gateway\Command\CommandPoolInterface
     */
    protected $commandPool;

    /**
     * @var PaymentDataObjectFactoryInterface
     */
    protected $paymentDataObjectFactory;

    /**
     * @var \Magento\Quote\Api\CartRepositoryInterface
     */
    protected $quoteRepository;

    /**
     * @var \Digia\AvardaCheckout\Api\PaymentQueueRepositoryInterface
     */
    protected $paymentQueueRepository;

    /**
     * @var \Digia\AvardaCheckout\Api\Data\PaymentQueueInterfaceFactory
     */
    protected $paymentQueueFactory;

    /**
     * @var \Magento\Quote\Api\CartManagementInterface
     */
    protected $cartManagement;

    /**
     * @var CartInterface
     */
    protected $quote;

    /**
     * QuotePaymentManagement constructor.
     *
     * @param \Digia\AvardaCheckout\Api\ItemManagementInterface $itemManagement
     * @param ItemStorageInterface $itemStorage
     * @param \Digia\AvardaCheckout\Helper\Quote $paymentDataHelper
     * @param \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool
     * @param PaymentDataObjectFactoryInterface $paymentDataObjectFactory
     * @param \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
     * @param \Digia\AvardaCheckout\Api\PaymentQueueRepositoryInterface $paymentQueueRepository
     * @param \Magento\Quote\Api\CartManagementInterface $cartManagement
     */
    public function __construct(
        \Digia\AvardaCheckout\Api\ItemManagementInterface $itemManagement,
        ItemStorageInterface $itemStorage,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper,
        \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool,
        PaymentDataObjectFactoryInterface $paymentDataObjectFactory,
        \Magento\Quote\Api\CartRepositoryInterface $quoteRepository,
        \Digia\AvardaCheckout\Api\PaymentQueueRepositoryInterface $paymentQueueRepository,
        \Digia\AvardaCheckout\Api\Data\PaymentQueueInterfaceFactory $paymentQueueFactory,
        \Magento\Quote\Api\CartManagementInterface $cartManagement
    ) {
        $this->itemManagement = $itemManagement;
        $this->itemStorage = $itemStorage;
        $this->paymentDataHelper = $paymentDataHelper;
        $this->commandPool = $commandPool;
        $this->paymentDataObjectFactory = $paymentDataObjectFactory;
        $this->quoteRepository = $quoteRepository;
        $this->paymentQueueRepository = $paymentQueueRepository;
        $this->paymentQueueFactory = $paymentQueueFactory;
        $this->cartManagement = $cartManagement;
    }

    /**
     * {@inheritdoc}
     */
    public function getPurchaseId($cartId)
    {
        $quote = $this->getQuote($cartId);
        $purchaseId = $this->paymentDataHelper->getPurchaseId(
            $quote->getPayment()
        );

        if (!$purchaseId) {
            $purchaseId = $this->initializePurchase($quote);
        }

        return $purchaseId;
    }

    /**
     * {@inheritdoc}
     */
    public function initializePurchase(CartInterface $quote)
    {
        $quote->collectTotals();

        // Execute InitializePurchase command
        $arguments = $this->getCommandArguments($quote);
        $this->commandPool->get('avarda_initialize_payment')
            ->execute($arguments);

        /**
         * Save the additional data to quote payment
         * @see \Digia\AvardaCheckout\Gateway\Response\InitializePaymentHandler
         */
        $quote->save();


        $purchaseId = $this->paymentDataHelper->getPurchaseId(
            $quote->getPayment()
        );

        /** @var \Digia\AvardaCheckout\Api\Data\PaymentQueueInterface $paymentQueue */
        $paymentQueue = $this->paymentQueueFactory->create();
        $paymentQueue->setPurchaseId($purchaseId);
        $paymentQueue->setQuoteId($quote->getId());

        $this->paymentQueueRepository->save($paymentQueue);

        // Get purchase ID from payment additional information
        return $purchaseId;
    }

    /**
     * {@inheritdoc}
     */
    public function getItemDetailsList($cartId)
    {
        $quote = $this->getQuote($cartId);
        $this->itemStorage->setItems($quote->getItems());
        return $this->itemManagement->getItemDetailsList();
    }

    /**
     * {@inheritdoc}
     */
    public function updateItems(CartInterface $quote)
    {
        // Execute UpdateItems command
        $arguments = $this->getCommandArguments($quote);
        $this->commandPool->get('avarda_update_items')->execute($arguments);
    }

    /**
     * {@inheritdoc}
     */
    public function freezeCart($cartId)
    {
        $quote = $this->getQuote($cartId);
        if (!$this->paymentDataHelper->isAvardaPayment($quote->getPayment())) {
            throw new PaymentException(__('No purchase ID on quote %s.', $cartId));
        }

        /**
         * Setting the quote is_active to false hides it from the frontend and
         * renders the customer unable to manipulate the cart while payment is
         * processed.
         */
        $quote->setIsActive(false);
        $quote->save();
    }

    /**
     * {@inheritdoc}
     */
    public function unfreezeCart($cartId)
    {
        $quote = $this->getQuote($cartId);
        if (!$this->paymentDataHelper->isAvardaPayment($quote->getPayment())) {
            throw new PaymentException(__('No purchase ID on quote %s.', $cartId));
        }

        /** We want to unfreeze the cart before placing an order. */
        $quote->setIsActive(true);
        $quote->save();
    }

    /**
     * {@inheritdoc}
     */
    public function updatePaymentStatus($cartId)
    {
        $quote = $this->getQuote($cartId);

        if (!$this->paymentDataHelper->isAvardaPayment($quote->getPayment())) {
            throw new PaymentException(__('No purchase ID on quote %s.', $cartId));
        }

        // Execute InitializePurchase command
        $arguments = $this->getCommandArguments($quote);
        $this->commandPool->get('avarda_get_payment_status')->execute($arguments);
    }

    /**
     * {@inheritdoc}
     */
    public function placeOrder($purchaseId, $isGuest = false)
    {
        $quoteId = null;

        try {
            $quote = $this->getQuoteByPurchaseId($purchaseId);
            $quoteId = $quote->getId();
            if ($this->paymentDataHelper->getPurchaseId(
                    $quote->getPayment()
                ) != $purchaseId
            ) {
                throw new PaymentException(__('Failed to save Avarda order. Please try again later.'));
            }
            $this->updatePaymentStatus($quoteId);

            // Unfreeze cart before placing the order
            $this->unfreezeCart($quoteId);

            // Must set checkout method for guests
            if ($isGuest) {
                $quote->setCheckoutMethod(\Magento\Quote\Api\CartManagementInterface::METHOD_GUEST);
            }

            $this->cartManagement->placeOrder($quoteId);

            // Clean payment queue
            $paymentQueue = $this->paymentQueueRepository->get($purchaseId);
            $this->paymentQueueRepository->delete($paymentQueue);
        } catch (\Exception $e) {

            // Freeze cart again if place order failed
            if (isset($quoteId) !== null) {
                $this->freezeCart($quoteId);
            }

            throw new PaymentException(
                __('Failed to save Avarda order. Please try again later.')
            );
        }
    }

    /**
     * Prepare arguments for gateway commands
     *
     * @param CartInterface $quote
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

    /**
     * Get quote by cart/quote ID
     *
     * @param $cartId
     * @return CartInterface
     */
    protected function getQuote($cartId)
    {
        if (!isset($this->quote) || $this->quote->getId() != $cartId) {
            $this->quote = $this->quoteRepository->get($cartId);
        }

        return $this->quote;
    }

    /**
     * Get quote by cart/quote ID
     *
     * @param $purchaseId
     * @return CartInterface
     */
    protected function getQuoteByPurchaseId($purchaseId)
    {
        if (!isset($this->quote) ||
            $this->paymentDataHelper->getPurchaseId(
                $this->quote->getPayment()
            ) != $purchaseId
        ) {
            $paymentQueue = $this->paymentQueueRepository->get($purchaseId);
            if ($paymentQueue->getQuoteId() === null) {
                throw new \Exception(__('No quote linked with purchase ID "%purchase_id"', [
                    'purchase_id' => $purchaseId
                ]));
            }

            $this->getQuote($paymentQueue->getQuoteId());
        }

        return $this->quote;
    }
}
