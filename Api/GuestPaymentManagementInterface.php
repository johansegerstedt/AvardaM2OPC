<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api;

/**
 * Interface for managing Avarda guest payment information
 * @api
 */
interface GuestPaymentManagementInterface
{
    /**
     * Get purchase ID for Avarda payment
     *
     * @param string $cartId
     * @return \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface
     * @throws \Magento\Framework\Exception\PaymentException
     */
    public function getPurchaseId($cartId);
}
