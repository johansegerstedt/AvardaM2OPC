<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
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
     * @throws \Magento\Framework\Exception\PaymentException
     * @return \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface
     */
    public function getPurchaseId($cartId);

    /**
     * Freeze the cart before redirected to payment. Return 200 status code if
     * everything is OK.
     *
     * @param string $cartId
     * @throws \Magento\Framework\Exception\PaymentException
     * @return void
     */
    public function freezeCart($cartId);

    /**
     * Get quote items additional information not provided by Magento Webapi
     *
     * @param string $cartId
     * @throws \Magento\Framework\Exception\PaymentException
     * @return \Digia\AvardaCheckout\Api\Data\ItemDetailsListInterface
     */
    public function getItemDetailsList($cartId);
}
