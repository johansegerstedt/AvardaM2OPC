<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

use Magento\Quote\Api\Data\CartItemInterface;
use Magento\Sales\Api\Data\OrderItemInterface;

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
     * @param mixed $item of the quote, order, invoice or credit memo
     *
     * @return ItemDataObjectInterface
     */
    public function create($item);
}
