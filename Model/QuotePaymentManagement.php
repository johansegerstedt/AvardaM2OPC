<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Magento\Framework\Exception\PaymentException;
use Magento\Payment\Model\InfoInterface;
use Magento\Quote\Api\CartManagementInterface;
use Magento\Quote\Api\Data\CartInterface;

/**
 * QuotePaymentManagement
 * @see \Digia\AvardaCheckout\Api\QuotePaymentManagementInterface
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class QuotePaymentManagement implements QuotePaymentManagementInterface
{
    /**
     * Required for GET /avarda-items.
     *
     * @var \Digia\AvardaCheckout\Api\ItemManagementInterface $itemManagement
     */
    protected $itemManagement;

    /**
     * Required for populating requests with item data.
     *
     * @var \Digia\AvardaCheckout\Api\ItemStorageInterface $itemStorage
     */
    protected $itemStorage;

    /**
     * Helper for reading payment info instances, e.g. getting purchase ID
     * from quote payment.
     *
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelper;

    /**
     * Helper to determine Avarda's purchase state.
     *
     * @var \Digia\AvardaCheckout\Helper\PurchaseState
     */
    protected $purchaseStateHelper;

    /**
     * Command pool for API requests to Avarda.
     *
     * @var \Magento\Payment\Gateway\Command\CommandPoolInterface
     */
    protected $commandPool;

    /**
     * Required for executing API requests from command pool.
     *
     * @var \Magento\Payment\Gateway\Data\PaymentDataObjectFactoryInterface
     */
    protected $paymentDataObjectFactory;

    /**
     * Repository to load quote from database.
     *
     * @var \Magento\Quote\Api\CartRepositoryInterface
     */
    protected $quoteRepository;

    /**
     * Repository for Avarda's payment queue which links Avarda's purchase ID to
     * Magento's quote ID.
     *
     * @var \Digia\AvardaCheckout\Api\PaymentQueueRepositoryInterface
     */
    protected $paymentQueueRepository;

    /**
     * Required to operate with payment queue repository.
     *
     * @var \Digia\AvardaCheckout\Api\Data\PaymentQueueInterfaceFactory
     */
    protected $paymentQueueFactory;

    /**
     * Required for placing order in Magento.
     *
     * @var \Magento\Quote\Api\CartManagementInterface
     */
    protected $cartManagement;

    /**
     * Temporary quote object to limit calls to repository.
     *
     * @var CartInterface
     */
    protected $quote;

    /**
     * QuotePaymentManagement constructor.
     *
     * @param \Digia\AvardaCheckout\Api\ItemManagementInterface $itemManagement
     * @param \Digia\AvardaCheckout\Api\ItemStorageInterface $itemStorage
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     * @param \Digia\AvardaCheckout\Helper\PurchaseState $purchaseStateHelper
     * @param \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool
     * @param \Magento\Payment\Gateway\Data\PaymentDataObjectFactoryInterface $paymentDataObjectFactory
     * @param \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
     * @param \Digia\AvardaCheckout\Api\PaymentQueueRepositoryInterface $paymentQueueRepository
     * @param \Digia\AvardaCheckout\Api\Data\PaymentQueueInterfaceFactory $paymentQueueFactory
     * @param \Magento\Quote\Api\CartManagementInterface $cartManagement
     */
    public function __construct(
        \Digia\AvardaCheckout\Api\ItemManagementInterface $itemManagement,
        \Digia\AvardaCheckout\Api\ItemStorageInterface $itemStorage,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper,
        \Digia\AvardaCheckout\Helper\PurchaseState $purchaseStateHelper,
        \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool,
        \Magento\Payment\Gateway\Data\PaymentDataObjectFactoryInterface $paymentDataObjectFactory,
        \Magento\Quote\Api\CartRepositoryInterface $quoteRepository,
        \Digia\AvardaCheckout\Api\PaymentQueueRepositoryInterface $paymentQueueRepository,
        \Digia\AvardaCheckout\Api\Data\PaymentQueueInterfaceFactory $paymentQueueFactory,
        \Magento\Quote\Api\CartManagementInterface $cartManagement
    ) {
        $this->itemManagement = $itemManagement;
        $this->itemStorage = $itemStorage;
        $this->paymentDataHelper = $paymentDataHelper;
        $this->purchaseStateHelper = $purchaseStateHelper;
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
     *
     * @param CartInterface|\Magento\Quote\Model\Quote $quote
     */
    public function initializePurchase(CartInterface $quote)
    {
        $quote->collectTotals();

        // Execute InitializePurchase command
        $this->executeCommand('avarda_initialize_payment', $quote);

        /**
         * Save the additional data to quote payment
         * @see \Digia\AvardaCheckout\Gateway\Response\InitializePaymentHandler
         */
        $this->quoteRepository->save($quote);

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
        $this->executeCommand('avarda_update_items', $quote);
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
        $this->quoteRepository->save($quote);
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
        if (!$quote->getIsActive()) {
            $quote->setIsActive(true);
            $this->quoteRepository->save($quote);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function updatePaymentStatus($cartId)
    {
        $quote = $this->getQuote($cartId);
        if (!$this->paymentDataHelper->isAvardaPayment($quote->getPayment())) {
            throw new \Exception(__('No purchase ID on quote %cart_id.', [
                'cart_id' => $cartId
            ]));
        }

        // Execute GetPaymentStatus command
        $this->executeCommand('avarda_get_payment_status', $quote);
    }

    /**
     * {@inheritdoc}
     */
    public function placeOrder($cartId, $isGuest = false)
    {
        $quote = $this->getQuote($cartId);
        $this->updatePaymentStatus($cartId);

        // Unfreeze cart before placing the order
        $this->unfreezeCart($cartId);

        // Must set checkout method for guests
        if ($isGuest) {
            $quote->setCheckoutMethod(CartManagementInterface::METHOD_GUEST);
        }

        $this->cartManagement->placeOrder($cartId);

        // Clean payment queue
        $purchaseId = $this->paymentDataHelper->getPurchaseId(
            $quote->getPayment()
        );
        $paymentQueue = $this->paymentQueueRepository->get($purchaseId);
        $this->paymentQueueRepository->delete($paymentQueue);
    }

    /**
     * {@inheritdoc}
     */
    public function getQuoteIdByPurchaseId($purchaseId)
    {
        $paymentQueue = $this->paymentQueueRepository->get($purchaseId);
        if ($paymentQueue->getQuoteId() === null) {
            throw new PaymentException(__('No cart linked with purchase ID "%purchase_id"', [
                'purchase_id' => $purchaseId
            ]));
        }

        $payment = $this->getQuote($paymentQueue->getQuoteId())->getPayment();
        if ($this->paymentDataHelper->getPurchaseId($payment) != $purchaseId) {
            throw new PaymentException(__('Purchase ID "%purchase_id" is outdated', [
                'purchase_id' => $purchaseId
            ]));
        }

        return $paymentQueue->getQuoteId();
    }

    /**
     * Execute command for request to Avarda API based on quote.
     *
     * @param string $commandCode
     * @param CartInterface|\Magento\Quote\Model\Quote $quote
     * @return void
     */
    protected function executeCommand($commandCode, CartInterface $quote)
    {
        $arguments['amount'] = $quote->getGrandTotal();

        /** @var InfoInterface|null $payment */
        $payment = $quote->getPayment();
        if ($payment !== null && $payment instanceof InfoInterface) {
            $arguments['payment'] = $this->paymentDataObjectFactory
                ->create($payment);
        }

        $this->commandPool->get($commandCode)
            ->execute($arguments);
    }

    /**
     * Get quote by cart/quote ID
     *
     * @param int $cartId
     * @return CartInterface|\Magento\Quote\Model\Quote
     */
    protected function getQuote($cartId)
    {
        if (!isset($this->quote) || $this->quote->getId() != $cartId) {
            $this->quote = $this->quoteRepository->get($cartId);
        }

        return $this->quote;
    }
}
