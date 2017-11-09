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
 * Interface ItemDataObjectInterface
 * @package Digia\AvardaCheckout\Gateway\Data
 * @api
 * @since 100.0.2
 */
interface ItemDataObjectInterface
{
    /**
     * Returns order
     *
     * @return CartItemInterface|OrderItemInterface
     */
    public function getItem();
}
