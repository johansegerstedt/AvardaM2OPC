<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api;

/**
 * Interface for managing Avarda payment information
 * @api
 */
interface PaymentManagementInterface
{
    /**
     * Get purchase ID for Avarda payment
     *
     * @param int $cartId
     * @return \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface
     * @throws \Magento\Framework\Exception\PaymentException
     */
    public function getPurchaseId($cartId);

    /**
     * Freeze the cart before redirected to payment. Return 200 status code if
     * everything is OK.
     *
     * @param int $cartId
     * @throws \Magento\Framework\Exception\PaymentException
     * @return void
     */
    public function freezeCart($cartId);

    /**
     * Update order (quote) from Avarda and save order to Magento.
     *
     * @param int $cartId
     * @throws \Magento\Framework\Exception\PaymentException
     * @return void
     */
    public function updateAndPlaceOrder($cartId);
}
