<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api;

use Magento\Quote\Api\Data\CartInterface;

/**
 * Interface for managing Avarda payment information
 * @api
 */
interface QuotePaymentManagementInterface
{
    /**
     * Get purchase ID for quote
     *
     * @param string $cartId
     * @return string
     */
    public function getPurchaseId($cartId);

    /**
     * Make Avarda InitializePurchase call and return purchase ID
     *
     * @param CartInterface $quote
     * @return string
     */
    public function initializePurchase(CartInterface $quote);

    /**
     * Get quote items additional information not provided by Magento
     *
     * @param string $cartId
     * @return \Digia\AvardaCheckout\Api\Data\ItemDetailsListInterface
     */
    public function getItemDetailsList($cartId);

    /**
     * Make Avarda UpdateItems call and return purchase ID
     *
     * @param CartInterface $quote
     * @return void
     */
    public function updateItems(CartInterface $quote);

    /**
     * Freeze the cart before redirected to payment.
     *
     * @param string $cartId
     * @return void
     */
    public function freezeCart($cartId);

    /**
     * Unfreeze the cart before placing order in Magento.
     *
     * @param string $cartId
     * @return void
     */
    public function unfreezeCart($cartId);

    /**
     * Update order (quote) from Avarda payment status.
     *
     * @param string $cartId
     * @return void
     */
    public function updatePaymentStatus($cartId);
}
