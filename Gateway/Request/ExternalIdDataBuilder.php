<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface;
use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;

/**
 * Class ExternalIdDataBuilder
 */
class ExternalIdDataBuilder implements BuilderInterface
{
    /**
     * The purchase ID (external ID) of request
     */
    const EXTERNAL_ID = 'ExternalId';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        $paymentDO = SubjectReader::readPayment($buildSubject);
        $payment = $paymentDO->getPayment();

        $additionalInformation = $payment->getAdditionalInformation();
        $purchaseId = $additionalInformation[PaymentDetailsInterface::PURCHASE_ID];

        return [self::EXTERNAL_ID => $purchaseId];
    }
}
