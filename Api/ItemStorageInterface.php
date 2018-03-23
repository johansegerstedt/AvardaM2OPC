<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api;

use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectInterface;

/**
 * Interface for storing Avarda item information
 * @api
 */
interface ItemStorageInterface
{
    /**
     * @param ItemDataObjectInterface[] $items
     * @return $this
     */
    public function setItems($items);

    /**
     * @param ItemDataObjectInterface $item
     * @return $this
     */
    public function addItem(ItemDataObjectInterface $item);

    /**
     * @return ItemDataObjectInterface[]
     */
    public function getItems();

    /**
     * @return $this
     */
    public function reset();
}
