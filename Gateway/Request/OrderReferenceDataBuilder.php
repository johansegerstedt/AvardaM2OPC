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
 * Class OrderReferenceDataBuilder
 */
class OrderReferenceDataBuilder implements BuilderInterface
{
    /**
     * A unique identifier for Avarda to find the order
     */
    const ORDER_REFERENCE = 'OrderReference';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        $paymentDO = SubjectReader::readPayment($buildSubject);
        $order     = $paymentDO->getOrder();

        return [self::ORDER_REFERENCE => $order->getOrderIncrementId()];
    }
}
