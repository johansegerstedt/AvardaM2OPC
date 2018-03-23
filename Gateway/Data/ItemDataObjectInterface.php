<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

/**
 * Interface ItemDataObjectInterface
 *
 * @api
 * @since 0.2.0
 */
interface ItemDataObjectInterface
{
    /**
     * Returns order item
     *
     * @return ItemAdapterInterface
     */
    public function getItem();

    /**
     * Returns subject data for builders
     *
     * @return array
     */
    public function getSubject();
}
