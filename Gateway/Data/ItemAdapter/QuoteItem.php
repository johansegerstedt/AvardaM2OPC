<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data\ItemAdapter;

use Digia\AvardaCheckout\Gateway\Data\ItemAdapterInterface;
use Magento\Quote\Api\Data\CartItemInterface;

/**
 * Class ItemAdapter\QuoteItem
 */
class QuoteItem implements ItemAdapterInterface
{
    /**
     * @var CartItemInterface
     */
    protected $quoteItem;

    /**
     * QuoteItem constructor.
     *
     * @param CartItemInterface $quoteItem
     */
    public function __construct(
        CartItemInterface $quoteItem
    ) {
        $this->quoteItem = $quoteItem;
    }

    /**
     * Get product ID
     *
     * @return integer|null
     */
    public function getProductId()
    {
        return $this->quoteItem->getProductId();
    }

    /**
     * Get parent item ID
     *
     * @return integer|null
     */
    public function getParentItemId()
    {
        return $this->quoteItem->getParentItemId();
    }

    /**
     * Get the item product name
     *
     * @return string
     */
    public function getName()
    {
        return $this->quoteItem->getName();
    }

    /**
     * Get the item SKU
     *
     * @return string
     */
    public function getSku()
    {
        return $this->quoteItem->getSku();
    }

    /**
     * Get additional data
     *
     * @return array
     */
    public function getAdditionalData()
    {
        return $this->quoteItem->getAdditionalData();
    }

    /**
     * Get product type
     *
     * @return string
     */
    public function getProductType()
    {
        return $this->quoteItem->getProductType();
    }

    /**
     * Get tax amount
     *
     * @return float
     */
    public function getTaxAmount()
    {
        return $this->quoteItem->getTaxAmount();
    }

    /**
     * Get tax percent/code
     *
     * @return float
     */
    public function getTaxPercent()
    {
        return $this->quoteItem->getTaxPercent();
    }

    /**
     * Get row total
     *
     * @return float
     */
    public function getRowTotal()
    {
        return $this->quoteItem->getRowTotal();
    }

    /**
     * Get row total including tax
     *
     * @return float
     */
    public function getRowTotalInclTax()
    {
        return $this->quoteItem->getRowTotalInclTax();
    }
}
