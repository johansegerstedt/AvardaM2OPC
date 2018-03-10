<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface;
use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;

/**
 * Class PurchaseIdDataBuilder
 */
class PurchaseIdDataBuilder implements BuilderInterface
{
    /**
     * The purchase ID of request
     */
    const PURCHASE_ID = 'PurchaseId';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        $paymentDO = SubjectReader::readPayment($buildSubject);
        $payment = $paymentDO->getPayment();

        $additionalInformation = $payment->getAdditionalInformation();
        $purchaseId = $additionalInformation[PaymentDetailsInterface::PURCHASE_ID];

        return [self::PURCHASE_ID => $purchaseId];
    }
}
