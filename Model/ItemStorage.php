<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\ItemStorageInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class ItemStorage implements ItemStorageInterface
{
    /**
     * @var \Magento\Quote\Api\Data\CartItemInterface[]
     */
    protected $items;

    /**
     * {@inheritdoc}
     */
    public function setItems($items)
    {
        if ($items !== null) {
            $this->items = $items;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getItems()
    {
        if (!isset($this->items)) {
            return [];
        }

        return $this->items;
    }
}