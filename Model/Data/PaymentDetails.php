<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model\Data;

use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface;
use Magento\Framework\Model\AbstractExtensibleModel;

/**
 * @codeCoverageIgnoreStart
 */
class PaymentDetails extends AbstractExtensibleModel implements
    PaymentDetailsInterface
{
    /**
     * {@inheritdoc}
     */
    public function getPurchaseId()
    {
        return $this->getData(self::PURCHASE_ID);
    }

    /**
     * {@inheritdoc}
     */
    public function setPurchaseId($purchaseId)
    {
        return $this->setData(self::PURCHASE_ID, $purchaseId);
    }
}
