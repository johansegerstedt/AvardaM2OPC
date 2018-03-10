<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Helper;

use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface;
use Magento\Quote\Api\Data\CartInterface;

/**
 * Class Quote
 */
class Quote
{
    /**
     * Get purchase ID from quote payment
     *
     * @param CartInterface $payment
     * @deprecated 0.2.0
     * @return string|bool
     */
    public function getPurchaseId(CartInterface $quote)
    {
        $payment = $quote->getPayment();
        $additionalInformation = $payment->getAdditionalInformation();
        if (is_array($additionalInformation) &&
            array_key_exists(
                PaymentDetailsInterface::PURCHASE_ID,
                $additionalInformation
            )
        ) {
            return $additionalInformation[PaymentDetailsInterface::PURCHASE_ID];
        }

        return false;
    }
}
