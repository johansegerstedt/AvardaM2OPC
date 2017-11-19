<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

use Magento\Payment\Gateway\Data\OrderAdapterInterface;

/**
 * Class ShippingItemAdapter
 */
class ShippingItemAdapter implements ItemAdapterInterface
{
    /**
     * @var OrderAdapterInterface
     */
    protected $order;

    /**
     * ItemAdapter constructor.
     *
     * @param OrderAdapterInterface $order
     */
    public function __construct(
        OrderAdapterInterface $order
    ) {
        $this->order = $order;
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
        // TODO: shipping stuff
    }

    /**
     * Get the item SKU
     *
     * @return string
     */
    public function getSku()
    {
        // TODO: shipping stuff
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
        // TODO: shipping stuff
    }

    /**
     * Get tax percent/code
     *
     * @return float
     */
    public function getTaxPercent()
    {
        // TODO: shipping stuff
    }

    /**
     * Get row total
     *
     * @return float
     */
    public function getRowTotal()
    {
        // TODO: shipping stuff
    }

    /**
     * Get row total including tax
     *
     * @return float
     */
    public function getRowTotalInclTax()
    {
        // TODO: shipping stuff
    }

    /**
     * @return \Magento\Payment\Gateway\Data\AddressAdapterInterface|null
     */
    protected function getShippingAddress()
    {
        if (!isset($this->shippingAddress)) {
            $this->shippingAddress = $this->order->getShippingAddress();
        }

        return $this->shippingAddress;
    }
}
