<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data\ItemAdapter;

use Digia\AvardaCheckout\Gateway\Data\ItemAdapterInterface;
use Magento\Sales\Api\Data\OrderItemInterface;

/**
 * Class ItemAdapter\OrderItem
 */
class OrderItem implements ItemAdapterInterface
{
    /**
     * @var OrderItemInterface
     */
    protected $orderItem;

    /**
     * OrderItem constructor.
     *
     * @param OrderItemInterface $orderItem
     */
    public function __construct(
        OrderItemInterface $orderItem
    ) {
        $this->orderItem = $orderItem;
    }

    /**
     * Get product ID
     *
     * @return integer|null
     */
    public function getProductId()
    {
        return $this->orderItem->getProductId();
    }

    /**
     * Get parent item ID
     *
     * @return integer|null
     */
    public function getParentItemId()
    {
        return $this->orderItem->getParentItemId();
    }

    /**
     * Get the item product name
     *
     * @return string
     */
    public function getName()
    {
        return $this->orderItem->getName();
    }

    /**
     * Get the item SKU
     *
     * @return string
     */
    public function getSku()
    {
        return $this->orderItem->getSku();
    }

    /**
     * Get additional data
     *
     * @return string
     */
    public function getAdditionalData()
    {
        return $this->orderItem->getAdditionalData();
    }

    /**
     * Get product type
     *
     * @return string
     */
    public function getProductType()
    {
        return $this->orderItem->getProductType();
    }

    /**
     * Get tax amount
     *
     * @return float
     */
    public function getTaxAmount()
    {
        return $this->orderItem->getTaxAmount();
    }

    /**
     * Get tax percent/code
     *
     * @return float
     */
    public function getTaxPercent()
    {
        return $this->orderItem->getTaxPercent();
    }

    /**
     * Get row total
     *
     * @return float
     */
    public function getRowTotal()
    {
        return $this->orderItem->getRowTotal();
    }

    /**
     * Get row total including tax
     *
     * @return float
     */
    public function getRowTotalInclTax()
    {
        return $this->orderItem->getRowTotalInclTax();
    }
}
