<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data\ItemAdapter;

use Digia\AvardaCheckout\Gateway\Data\ItemAdapterInterface;

/**
 * Class ItemAdapter\ShipmentItem
 */
class ShipmentItem implements ItemAdapterInterface
{

    /**
     * Get product ID
     *
     * @return integer|null
     */
    public function getProductId()
    {
        // TODO: Implement getProductId() method.
    }

    /**
     * Get parent item ID
     *
     * @return integer|null
     */
    public function getParentItemId()
    {
        // TODO: Implement getParentItemId() method.
    }

    /**
     * Get the item product name
     *
     * @return string
     */
    public function getName()
    {
        // TODO: Implement getName() method.
    }

    /**
     * Get the item SKU
     *
     * @return string
     */
    public function getSku()
    {
        // TODO: Implement getSku() method.
    }

    /**
     * Get additional data
     *
     * @return array
     */
    public function getAdditionalData()
    {
        // TODO: Implement getAdditionalData() method.
    }

    /**
     * Get product type
     *
     * @return string
     */
    public function getProductType()
    {
        // TODO: Implement getProductType() method.
    }

    /**
     * Get tax amount
     *
     * @return float
     */
    public function getTaxAmount()
    {
        // TODO: Implement getTaxAmount() method.
    }

    /**
     * Get tax percent/code
     *
     * @return float
     */
    public function getTaxPercent()
    {
        // TODO: Implement getTaxPercent() method.
    }

    /**
     * Get row total
     *
     * @return float
     */
    public function getRowTotal()
    {
        // TODO: Implement getRowTotal() method.
    }

    /**
     * Get row total including tax
     *
     * @return float
     */
    public function getRowTotalInclTax()
    {
        // TODO: Implement getRowTotalInclTax() method.
    }
}