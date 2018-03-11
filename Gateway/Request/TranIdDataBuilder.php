<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;

/**
 * Class TranIdDataBuilder
 */
class TranIdDataBuilder implements BuilderInterface
{
    /**
     * A unique transaction ID
     */
    const TRAN_ID = 'TranId';

    /**
     * Helper for payment info instances, eg. to generate transaction IDs.
     *
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelper;

    /**
     * TranIdDataBuilder constructor.
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
        $paymentDO     = SubjectReader::readPayment($buildSubject);
        $transactionId = $this->paymentDataHelper->getTransactionId();
        $paymentDO->getPayment()->setTransactionId($transactionId);

        return [self::TRAN_ID => $transactionId];
    }
}
