<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

/**
 * Interface ItemDataObjectInterface
 * @api
 * @since 100.0.2
 */
interface ItemDataObjectInterface
{
    /**
     * Returns order
     *
     * @return ItemAdapterInterface
     */
    public function getItem();
}
