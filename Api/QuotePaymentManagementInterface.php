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
interface QuotePaymentManagementInterface
{
    /**
     * Get purchase ID for Avarda payment
     *
     * @param string $cartId
     * @return \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface
     */
    public function getPurchaseId($cartId);

    /**
     * Update items in Avarda
     *
     * @param \Magento\Quote\Api\Data\CartInterface $quote
     * @return void
     */
    public function updateItems(\Magento\Quote\Api\Data\CartInterface $quote);

    /**
     * Freeze the cart before redirected to payment.
     *
     * @param string $cartId
     * @return void
     */
    public function freezeCart($cartId);

    /**
     * Update order (quote) from Avarda payment status.
     *
     * @param string $cartId
     * @return void
     */
    public function updatePaymentStatus($cartId);
}
