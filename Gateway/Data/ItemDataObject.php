<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

class ItemDataObject implements ItemDataObjectInterface
{
    /**
     * @var OrderAdapterInterface
     */
    private $item;

    /**
     * @param ItemAdapterInterface $item
     */
    public function __construct(
        ItemAdapterInterface $item
    ) {
        $this->item = $item;
    }

    /**
     * Returns order
     *
     * @return ItemAdapterInterface
     */
    public function getItem()
    {
        return $this->item;
    }
}
