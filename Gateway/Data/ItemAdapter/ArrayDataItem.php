<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data\ItemAdapter;

use Digia\AvardaCheckout\Gateway\Data\ItemAdapterInterface;

/**
 * Class ItemAdapter\ShipmentItem
 */
class ArrayDataItem implements ItemAdapterInterface
{
    /**
     * @var array
     */
    protected $data = [];

    /**
     * ArrayDataItem constructor.
     *
     * @param array $data
     */
    public function __construct(
        array $data
    ) {
        $this->data = $data;
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
        if (array_key_exists('name', $this->data)) {
            return $this->data['name'];
        }

        return '';
    }

    /**
     * Get the item SKU
     *
     * @return string
     */
    public function getSku()
    {
        if (array_key_exists('sku', $this->data)) {
            return $this->data['sku'];
        }

        return '';
    }

    /**
     * Get additional data
     *
     * @return array
     */
    public function getAdditionalData()
    {
        return [];
    }

    /**
     * Get product type
     *
     * @return string
     */
    public function getProductType()
    {
        if (array_key_exists('product_type', $this->data)) {
            return $this->data['product_type'];
        }

        return 'undefined';
    }

    /**
     * Get tax amount
     *
     * @return float
     */
    public function getTaxAmount()
    {
        if (array_key_exists('tax_amount', $this->data)) {
            return $this->data['tax_amount'];
        }

        return 0.0;
    }

    /**
     * Get tax percent/code
     *
     * @return float
     */
    public function getTaxPercent()
    {
        if (array_key_exists('tax_percent', $this->data)) {
            return $this->data['tax_percent'];
        }

        return 0.0;
    }

    /**
     * Get row total
     *
     * @return float
     */
    public function getRowTotal()
    {
        if (array_key_exists('row_total', $this->data)) {
            return $this->data['row_total'];
        }

        return 0.0;
    }

    /**
     * Get row total including tax
     *
     * @return float
     */
    public function getRowTotalInclTax()
    {
        if (array_key_exists('row_total_incl_tax', $this->data)) {
            return $this->data['row_total_incl_tax'];
        }

        return 0.0;
    }
}