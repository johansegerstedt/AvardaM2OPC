<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Plugin\Model\Sales\Order;

use Digia\AvardaCheckout\Api\ItemStorageInterface;
use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectFactory;
use Digia\AvardaCheckout\Gateway\Data\ItemAdapter\ArrayDataItemFactory;
use Digia\AvardaCheckout\Gateway\Data\ItemAdapter\OrderItemFactory;
use Magento\Sales\Api\Data\CreditmemoInterface;

class CreditmemoCollectTotalsPrepareItems
{
    /**
     * @var \Psr\Log\LoggerInterface $logger
     */
    protected $logger;

    /**
     * @var ItemStorageInterface
     */
    protected $itemStorage;

    /**
     * @var ItemDataObjectFactory
     */
    protected $itemDataObjectFactory;

    /**
     * @var OrderItemFactory
     */
    protected $orderItemAdapterFactory;

    /**
     * @var ArrayDataItemFactory
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
     * CreditmemoCollectTotalsPrepareItems constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param ItemStorageInterface $itemStorage
     * @param ItemDataObjectFactory $itemDataObjectFactory
     * @param OrderItemFactory $orderItemAdapterFactory
     * @param ArrayDataItemFactory $arrayDataItemAdapterFactory
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        ItemStorageInterface $itemStorage,
        ItemDataObjectFactory $itemDataObjectFactory,
        OrderItemFactory $orderItemAdapterFactory,
        ArrayDataItemFactory $arrayDataItemAdapterFactory,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
    ) {
        $this->logger = $logger;
        $this->itemStorage = $itemStorage;
        $this->itemDataObjectFactory = $itemDataObjectFactory;
        $this->orderItemAdapterFactory = $orderItemAdapterFactory;
        $this->arrayDataItemAdapterFactory = $arrayDataItemAdapterFactory;
        $this->paymentDataHelper = $paymentDataHelper;
    }

    /**
     * @param CreditmemoInterface $subject
     * @param CreditmemoInterface $result
     * @return CreditmemoInterface
     */
    public function afterCollectTotals(
        CreditmemoInterface $subject,
        CreditmemoInterface $result
    ) {
        try {
            $payment = $subject->getOrder()->getPayment();
            if (!$this->collectTotalsFlag &&
                $this->paymentDataHelper->isAvardaPayment($payment)
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
     * @param CreditmemoInterface $subject
     */
    public function prepareItemStorage(CreditmemoInterface $subject)
    {
        $this->itemStorage->reset();
        $this->prepareItems($subject);
        $this->prepareShipment($subject);
        $this->prepareGiftCards($subject);
    }

    /**
     * Create item data objects from invoice items
     *
     * @param CreditmemoInterface $subject
     */
    protected function prepareItems(CreditmemoInterface $subject)
    {
        foreach ($subject->getItems() as $item) {
            $orderItem = $item->getOrderItem();
            if (!$orderItem->getProductId() ||
                $orderItem->hasParentItemId() ||
                $item->isDeleted()
            ) {
                continue;
            }

            $itemAdapter = $this->orderItemAdapterFactory->create([
                'orderItem' => $orderItem
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
     * @param CreditmemoInterface $subject
     */
    protected function prepareShipment(CreditmemoInterface $subject)
    {
        $shippingAmount = $subject->getShippingAmount();
        if ($subject->getShippingAmount() > 0) {
            $order = $subject->getOrder();
            $itemAdapter = $this->arrayDataItemAdapterFactory->create([
                'data' => [
                    'name' => $order->getShippingDescription(),
                    'sku' => $order->getShippingMethod(),
                ],
            ]);
            $itemDataObject = $this->itemDataObjectFactory->create(
                $itemAdapter,
                1,
                $shippingAmount,
                $subject->getShippingTaxAmount()
            );

            $this->itemStorage->addItem($itemDataObject);
        }
    }

    /**
     * Create item data object from gift card information
     *
     * @param CreditmemoInterface $subject
     */
    protected function prepareGiftCards(CreditmemoInterface $subject)
    {
        $giftCardsAmount = $subject->getGiftCardsAmount();
        if ($giftCardsAmount > 0) {
            $itemAdapter = $this->arrayDataItemAdapterFactory->create([
                'data' => [
                    'name' => __('Gift Card'),
                    'sku' => __('giftcard'),
                ],
            ]);
            $itemDataObject = $this->itemDataObjectFactory->create(
                $itemAdapter,
                1,
                ($giftCardsAmount * -1),
                0
            );

            $this->itemStorage->addItem($itemDataObject);
        }
    }
}
