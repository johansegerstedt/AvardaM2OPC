<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

/**
 * Service for creation transferable item object from model
 *
 * @api
 * @since 0.2.0
 */
interface ItemDataObjectFactoryInterface
{
    /**
     * Creates Item Data Object
     *
     * @param ItemAdapterInterface
     * @param float $qty
     * @param float $amount
     * @param float $taxAmount
     *
     * @return ItemDataObjectInterface
     */
    public function create(
        ItemAdapterInterface $item,
        $qty,
        $amount,
        $taxAmount
    );
}
