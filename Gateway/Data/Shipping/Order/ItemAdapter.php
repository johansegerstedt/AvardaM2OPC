<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data\Shipping\Order;

use Digia\AvardaCheckout\Gateway\Data\ItemAdapterInterface;
use Magento\Payment\Gateway\Data\OrderAdapterInterface;
use Magento\Sales\Api\OrderRepositoryInterface;

/**
 * Class ItemAdapter
 */
class ItemAdapter implements ItemAdapterInterface
{
    /**
     * @var OrderAdapterInterface
     */
    protected $order;

    /**
     * @var OrderRepositoryInterface
     */
    protected $orderRepository;

    /**
     * @var \Magento\Sales\Api\Data\OrderInterface
     */
    protected $realOrder;

    /**
     * ItemAdapter constructor.
     *
     * @param OrderAdapterInterface $order
     * @param OrderRepositoryInterface $orderRepository
     */
    public function __construct(
        OrderAdapterInterface $order,
        OrderRepositoryInterface $orderRepository

    ) {
        $this->order = $order;
        $this->orderRepository = $orderRepository;
    }

    /**
     * Get product ID
     *
     * @return integer|null
     */
    public function getProductId()
    {
        return null;
    }

    /**
     * Get parent item ID
     *
     * @return integer|null
     */
    public function getParentItemId()
    {
        return null;
    }

    /**
     * Get the item product name
     *
     * @return string
     */
    public function getName()
    {
        return $this->getRealOrder()->getShippingDescription();
    }

    /**
     * Get the item SKU
     *
     * @return string
     */
    public function getSku()
    {
        return $this->getRealOrder()->getShippingMethod();
    }

    /**
     * Get additional data
     *
     * @return string
     */
    public function getAdditionalData()
    {
        // TODO: shipping stuff
    }

    /**
     * Get product type
     *
     * @return string
     */
    public function getProductType()
    {
        return 'shipping';
    }

    /**
     * Get tax amount
     *
     * @return float
     */
    public function getTaxAmount()
    {
        return $this->getRealOrder()->getShippingTaxAmount();
    }

    /**
     * Get tax percent/code
     *
     * @return float
     */
    public function getTaxPercent()
    {
        // TODO: Load tax percent from admin
        return 0.0;
    }

    /**
     * Get row total
     *
     * @return float
     */
    public function getRowTotal()
    {
        return $this->getRealOrder()->getShippingAmount();
    }

    /**
     * Get row total including tax
     *
     * @return float
     */
    public function getRowTotalInclTax()
    {
        return $this->getRealOrder()->getShippingInclTax();
    }

    /**
     * @return \Magento\Sales\Api\Data\OrderInterface
     */
    protected function getRealOrder()
    {
        if (!isset($this->realOrder)) {
            $entityId = $this->order->getId();
            $this->realOrder = $this->orderRepository->get($entityId);
        }

        return $this->realOrder;
    }
}
