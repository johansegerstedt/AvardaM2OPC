<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Response;

use Magento\Framework\Exception\PaymentException;
use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Response\HandlerInterface;

/**
 * Class InitializePaymentHandler
 */
class InitializePaymentHandler implements HandlerInterface
{
    /**
     * Payment additional information field name for purchase ID
     */
    const PURCHASE_ID = 'purchase_id';

    /**
     * @inheritdoc
     */
    public function handle(array $handlingSubject, array $response)
    {
        $purchaseId = reset($response);
        if (empty($purchaseId)) {
            throw new PaymentException(__('No purchase ID returned from Avarda'));
        }

        $paymentDO = SubjectReader::readPayment($handlingSubject);
        $payment = $paymentDO->getPayment();

        $payment->setAdditionalInformation(self::PURCHASE_ID, $purchaseId);
    }
}
