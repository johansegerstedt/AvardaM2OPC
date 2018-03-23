<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model\ResourceModel;

/**
 * Payment queue resource model
 */
class PaymentQueue extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{
    /**
     * Define main table
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('avarda_payment_queue', 'queue_id');
    }

    /**
     * Get payment queue identifier by purchase ID
     *
     * @param string $purchaseId
     * @return int|false
     */
    public function getIdByPurchaseId($purchaseId)
    {
        $connection = $this->getConnection();

        $select = $connection->select()->from('avarda_payment_queue', 'queue_id')->where('purchase_id = :purchase_id');

        $bind = [':purchase_id' => (string)$purchaseId];

        return $connection->fetchOne($select, $bind);
    }
}
