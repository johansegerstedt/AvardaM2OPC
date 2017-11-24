<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

/**
 * Class ItemAdapter
 */
interface ItemAdapterInterface
{
    /**
     * Get product ID
     *
     * @return integer
     */
    public function getProductId();

    /**
     * Get parent item ID
     *
     * @return integer
     */
    public function getParentItemId();

    /**
     * Get the item product name
     *
     * @return string
     */
    public function getName();

    /**
     * Get the item SKU
     *
     * @return string
     */
    public function getSku();

    /**
     * Get additional data
     *
     * @return array
     */
    public function getAdditionalData();

    /**
     * Get product type
     *
     * @return string
     */
    public function getProductType();

    /**
     * Get tax percent/code
     *
     * @return float
     */
    public function getTaxPercent();

    /**
     * Get row total
     *
     * @return float
     */
    public function getRowTotal();

    /**
     * Get row total including tax
     *
     * @return float
     */
    public function getRowTotalInclTax();
}