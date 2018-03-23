<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api\Data;

/**
 * Interface ItemDetailsListInterface
 * @api
 */
interface ItemDetailsListInterface
{
    /**
     * Constants defined for keys of array, makes typos less likely
     */
    const ITEMS = 'items';

    /**
     * Get quote items
     *
     * @return \Digia\AvardaCheckout\Api\Data\ItemDetailsInterface[]
     */
    public function getItems();

    /**
     * Set quote items
     *
     * @param \Digia\AvardaCheckout\Api\Data\ItemDetailsInterface[] $items
     * @return $this
     */
    public function setItems($items);

    /**
     * Set quote items
     *
     * @param \Digia\AvardaCheckout\Api\Data\ItemDetailsInterface $item
     * @return $this
     */
    public function addItem(ItemDetailsInterface $item);
}
