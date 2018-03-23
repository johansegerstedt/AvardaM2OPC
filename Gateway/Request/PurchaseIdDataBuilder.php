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
     * Helper for reading payment info instances, e.g. getting purchase ID
     * from quote payment.
     *
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelper;

    /**
     * ExternalIdDataBuilder constructor.
     *
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     */
    public function __construct(
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
    ) {
        $this->paymentDataHelper = $paymentDataHelper;
    }

    /**
     * {@inheritdoc}
     */
    public function build(array $buildSubject)
    {
        $paymentDO = SubjectReader::readPayment($buildSubject);
        $payment   = $paymentDO->getPayment();

        $purchaseId = $this->paymentDataHelper->getPurchaseId($payment);
        if (!$purchaseId) {
            return [];
        }

        return [self::PURCHASE_ID => $purchaseId];
    }
}
