<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Plugin\Model\Quote;

use Digia\AvardaCheckout\Api\ItemStorageInterface;
use Digia\AvardaCheckout\Gateway\Data\ItemAdapter\ArrayDataItemFactory;
use Digia\AvardaCheckout\Gateway\Data\ItemAdapter\QuoteItemFactory;
use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectFactory;
use Magento\Quote\Api\Data\CartInterface;

class QuoteCollectTotalsPrepareItems
{
    /**
     * @var \Psr\Log\LoggerInterface $logger
     */
    protected $logger;

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
     * @param ItemStorageInterface $itemStorage
     * @param ItemDataObjectFactory $itemDataObjectFactory,
     * @param QuoteItemFactory $quoteItemAdapterFactory
     * @param ArrayDataItemFactory $arrayDataItemAdapterFactory
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        ItemStorageInterface $itemStorage,
        ItemDataObjectFactory $itemDataObjectFactory,
        QuoteItemFactory $quoteItemAdapterFactory,
        ArrayDataItemFactory $arrayDataItemAdapterFactory,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
    ) {
        $this->logger = $logger;
        $this->itemStorage = $itemStorage;
        $this->itemDataObjectFactory = $itemDataObjectFactory;
        $this->quoteItemAdapterFactory = $quoteItemAdapterFactory;
        $this->arrayDataItemAdapterFactory = $arrayDataItemAdapterFactory;
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
            if (!$this->collectTotalsFlag &&
                count($subject->getItems()) > 0
            ) {
                $this->prepareItemStorage($subject);
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
    protected function prepareItemStorage(CartInterface $subject)
    {
        $this->itemStorage->reset();
        $this->prepareItems($subject);
        $this->prepareShipment($subject);
        $this->prepareGiftCards($subject);
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
        if ($shippingAddress && $shippingAddress->getShippingTaxAmount() > 0) {
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

    /**
     * Create item data object from gift card information
     *
     * @param CartInterface $subject
     */
    protected function prepareGiftCards(CartInterface $subject)
    {
        $giftCardsAmountUsed = $subject->getGiftCardsAmountUsed();
        if ($giftCardsAmountUsed > 0) {
            $itemAdapter = $this->arrayDataItemAdapterFactory->create([
                'data' => [
                    'name' => __('Gift Card'),
                    'sku' => __('giftcard'),
                ],
            ]);
            $itemDataObject = $this->itemDataObjectFactory->create(
                $itemAdapter,
                1,
                ($giftCardsAmountUsed * -1),
                0
            );

            $this->itemStorage->addItem($itemDataObject);
        }
    }
}
