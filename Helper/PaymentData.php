<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
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
            array_key_exists(self::STATE_ID, $additionalInformation)
        ) {
            $stateId = $additionalInformation[self::STATE_ID];
            if (!array_key_exists($stateId, PurchaseState::$states)) {
                return array_search(
                    PurchaseState::STATE_UNKNOWN,
                    PurchaseState::$states,
                    true
                );
            }

            return $stateId;
        }

        return array_search(
            PurchaseState::STATE_NEW,
            PurchaseState::$states,
            true
        );
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
        return sprintf(
            '%04X%04X-%04X-%04X-%04X-%04X%04X%04X',
            mt_rand(0, 65535),
            mt_rand(0, 65535),
            mt_rand(0, 65535),
            mt_rand(16384, 20479),
            mt_rand(32768, 49151),
            mt_rand(0, 65535),
            mt_rand(0, 65535),
            mt_rand(0, 65535)
        );
    }
}
