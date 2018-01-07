<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api;

/**
 * Interface for storing Avarda item information
 * @api
 */
interface ItemStorageInterface
{
    /**
     * @param \Magento\Quote\Api\Data\CartItemInterface[]|null $items
     * @return $this
     */
    public function setItems($items);

    /**
     * @return \Magento\Quote\Api\Data\CartItemInterface[]
     */
    public function getItems();
}