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
 * Service for creation transferable payment object from model
 *
 * @api
 * @since 100.0.2
 */
interface ItemDataObjectFactoryInterface
{
    /**
     * Creates Item Data Object
     *
     * @param CartItemInterface|OrderItemInterface $item of the quote or order
     *
     * @return ItemDataObjectInterface
     */
    public function create($item);
}
