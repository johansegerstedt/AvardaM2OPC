<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\ItemStorageInterface;
use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectInterface;

class ItemStorage implements ItemStorageInterface
{
    /**
     * @var ItemDataObjectInterface[]
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
    public function addItem(ItemDataObjectInterface $item)
    {
        $this->items = array_merge(
            $this->getItems(),
            [$item]
        );
    }

    /**
     * {@inheritdoc}
     */
    public function getItems()
    {
        if (isset($this->items)) {
            return $this->items;
        }

        return [];

    }
}