<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Helper;

use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface;
use Magento\Payment\Model\InfoInterface;

/**
 * Class PaymentData
 */
class PaymentData
{
    /**
     * Payment additional information field name for state ID
     */
    const STATE_ID = 'state_id';

    /**
     * Get purchase ID from payment info
     *
     * @param InfoInterface $payment
     * @return string|bool
     */
    public function getPurchaseId(InfoInterface $payment)
    {
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

    /**
     * Get state ID from payment info
     *
     * @param InfoInterface $payment
     * @return int
     */
    public function getStateId(InfoInterface $payment)
    {
        $additionalInformation = $payment->getAdditionalInformation();
        if (is_array($additionalInformation) &&
            array_key_exists(
                self::STATE_ID,
                $additionalInformation
            )
        ) {
            return $additionalInformation[self::STATE_ID];
        }

        return array_search(PurchaseState::STATE_NEW, PurchaseState::$states);
    }

    /**
     * Check if payment is an Avarda payment, simply by searching for the purchase ID
     *
     * @param InfoInterface $payment
     * @return bool
     */
    public function isAvardaPayment(InfoInterface $payment)
    {
        return is_string($this->getPurchaseId($payment));
    }

    /**
     * Generate a GUID v4 transaction ID
     *
     * @see http://php.net/manual/en/function.com-create-guid.php
     * @return string
     */
    public function getTransactionId()
    {
        if (function_exists('com_create_guid') === true) {
            return trim(com_create_guid(), '{}');
        }

        $data = openssl_random_pseudo_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
        return vsprintf(
            '%s%s-%s-%s-%s-%s%s%s',
            str_split(bin2hex($data), 4)
        );
    }
}
