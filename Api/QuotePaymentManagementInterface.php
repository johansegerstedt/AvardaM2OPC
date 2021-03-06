<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
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
     * @param CartInterface|\Magento\Quote\Model\Quote $quote
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
     * @param CartInterface|\Magento\Quote\Model\Quote $quote
     * @return void
     */
    public function updateItems(CartInterface $quote);

    /**
     * Setting the quote is_active to false hides it from the frontend and
     * renders the customer unable to manipulate the cart while payment is
     * processed.
     *
     * @param int  $cartId
     * @param bool $isActive
     * @return void
     */
    public function setQuoteIsActive($cartId, $isActive);

    /**
     * Update order (quote) from Avarda payment status.
     *
     * @param string $cartId
     * @return void
     */
    public function updatePaymentStatus($cartId);

    /**
     * Prepare and save order to Magento.
     *
     * @param string $cartId
     * @param bool $isGuest
     * @return void
     */
    public function placeOrder($cartId, $isGuest = false);

    /**
     * Get quote ID by Avarda purchase ID
     *
     * @param string $purchaseId
     * @throws \Magento\Framework\Exception\PaymentException
     * @return int
     */
    public function getQuoteIdByPurchaseId($purchaseId);
}
