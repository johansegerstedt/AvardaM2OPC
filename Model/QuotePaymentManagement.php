<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\ItemStorageInterface;
use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Digia\AvardaCheckout\Gateway\Data\ItemAdapter\ArrayDataItemFactory;
use Digia\AvardaCheckout\Gateway\Data\ItemAdapter\QuoteItemFactory;
use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectFactory;
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
     * @var ItemDataObjectFactory $itemDataObjectFactory
     */
    protected $itemDataObjectFactory;

    /**
     * @var QuoteItemFactory $quoteItemAdapterFactory
     */
    protected $quoteItemAdapterFactory;

    /**
     * @var ArrayDataItemFactory $arrayDataItemAdapterFactory
     */
    protected $arrayDataItemAdapterFactory;

    /**
     * @var \Digia\AvardaCheckout\Helper\Quote
     */
    protected $quoteHelper;

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
     * @var CartInterface
     */
    protected $quote;

    /**
     * QuotePaymentManagement constructor.
     *
     * @param \Digia\AvardaCheckout\Api\ItemManagementInterface $itemManagement
     * @param ItemStorageInterface $itemStorage
     * @param ItemDataObjectFactory $itemDataObjectFactory
     * @param QuoteItemFactory $quoteItemAdapterFactory
     * @param ArrayDataItemFactory $arrayDataItemAdapterFactory
     * @param \Digia\AvardaCheckout\Helper\Quote $quoteHelper
     * @param \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool
     * @param PaymentDataObjectFactoryInterface $paymentDataObjectFactory
     * @param \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
     */
    public function __construct(
        \Digia\AvardaCheckout\Api\ItemManagementInterface $itemManagement,
        ItemStorageInterface $itemStorage,
        ItemDataObjectFactory $itemDataObjectFactory,
        QuoteItemFactory $quoteItemAdapterFactory,
        ArrayDataItemFactory $arrayDataItemAdapterFactory,
        \Digia\AvardaCheckout\Helper\Quote $quoteHelper,
        \Magento\Payment\Gateway\Command\CommandPoolInterface $commandPool,
        PaymentDataObjectFactoryInterface $paymentDataObjectFactory,
        \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
    ) {
        $this->itemManagement = $itemManagement;
        $this->itemStorage = $itemStorage;
        $this->itemDataObjectFactory = $itemDataObjectFactory;
        $this->quoteItemAdapterFactory = $quoteItemAdapterFactory;
        $this->arrayDataItemAdapterFactory = $arrayDataItemAdapterFactory;
        $this->quoteHelper = $quoteHelper;
        $this->commandPool = $commandPool;
        $this->paymentDataObjectFactory = $paymentDataObjectFactory;
        $this->quoteRepository = $quoteRepository;
    }

    /**
     * {@inheritdoc}
     */
    public function getPurchaseId($cartId)
    {
        $quote = $this->getQuote($cartId);
        if (!($purchaseId = $this->quoteHelper->getPurchaseId($quote))) {
            $purchaseId = $this->initializePurchase($quote);
        }

        return $purchaseId;
    }

    /**
     * {@inheritdoc}
     */
    public function initializePurchase(CartInterface $quote)
    {
        $this->prepareItemStorage($quote);

        // Execute InitializePurchase command
        $arguments = $this->getCommandArguments($quote);
        $this->commandPool->get('avarda_initialize_payment')
            ->execute($arguments);

        /**
         * Save the additional data to quote payment
         * @see \Digia\AvardaCheckout\Gateway\Response\InitializePaymentHandler
         */
        $quote->save();

        // Get purchase ID from payment additional information
        return $this->quoteHelper->getPurchaseId($quote);
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
        if (!$this->quoteHelper->getPurchaseId($quote)) {
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
        if (!$this->quoteHelper->getPurchaseId($quote)) {
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
        if (!$this->quoteHelper->getPurchaseId($quote)) {
            throw new PaymentException(__('No purchase ID on quote %s.', $cartId));
        }

        // Execute InitializePurchase command
        $arguments = $this->getCommandArguments($quote);
        $this->commandPool->get('avarda_get_payment_status')->execute($arguments);
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
     * Get quote from cart/quote ID
     *
     * @param $cartId
     * @return CartInterface
     */
    protected function getQuote($cartId)
    {
        if (!isset($quote) || $quote->getId() != $cartId) {
            $this->quote = $this->quoteRepository->get($cartId);
        }

        return $this->quote;
    }

    /**
     * Populate the item storage with Avarda items needed for request building
     *
     * @param CartInterface $subject
     */
    public function prepareItemStorage(CartInterface $subject)
    {
        $this->prepareItems($subject);
        $this->prepareShipment($subject);
        //$this->buildGiftCard($subject);
    }

    /**
     * Create item data objects from quote items
     *
     * @param CartInterface $subject
     */
    protected function prepareItems(CartInterface $subject)
    {
        foreach ($subject->getItems() as $item) {
            if (!$item->getProductId() ||
                $item->hasParentItemId() ||
                $item->isDeleted()
            ) {
                continue;
            }

            $itemAdapter = $this->quoteItemAdapterFactory->create([
                'quoteItem' => $item
            ]);
            $itemDataObject = $this->itemDataObjectFactory->create(
                $itemAdapter,
                $item->getQty(),
                ($item->getRowTotalInclTax() - $item->getDiscountAmount()),
                (
                    $item->getTaxAmount() +
                    $item->getHiddenTaxAmount() +
                    $item->getWeeeTaxAppliedAmount()
                )
            );

            $this->itemStorage->addItem($itemDataObject);
        }
    }

    /**
     * Create item data object from shipment information
     *
     * @param CartInterface $subject
     */
    protected function prepareShipment(CartInterface $subject)
    {
        $shippingAddress = $subject->getShippingAddress();
        if ($shippingAddress) {
            $itemAdapter = $this->arrayDataItemAdapterFactory->create([
                'data' => [
                    'name' => $shippingAddress->getShippingDescription(),
                    'sku' => $shippingAddress->getShippingMethod(),
                ],
            ]);
            $itemDataObject = $this->itemDataObjectFactory->create(
                $itemAdapter,
                1,
                $shippingAddress->getShippingInclTax(),
                $shippingAddress->getShippingTaxAmount()
            );

            $this->itemStorage->addItem($itemDataObject);
        }
    }
}
