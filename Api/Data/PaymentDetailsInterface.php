<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api\Data;

/**
 * Interface PaymentDetailsInterface
 * @api
 */
interface PaymentDetailsInterface
{
    /**
     * Constants defined for keys of array, makes typos less likely
     */
    const PURCHASE_ID = 'purchase_id';

    /**
     * Return the generated purchase ID
     *
     * @return string
     */
    public function getPurchaseId();

    /**
     * Return the generated purchase ID
     *
     * @return string $purchaseId
     * @return $this
     */
    public function setPurchaseId($purchaseId);
}
