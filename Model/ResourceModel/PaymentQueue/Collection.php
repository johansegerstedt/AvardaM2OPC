<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model\ResourceModel\PaymentQueue;

/**
 * Payment queue collection.
 */
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * Initializes collection
     *
     * @return void
     */
    protected function _construct()
    {
        $this->addFilterToMap('queue_id', 'main_table.queue_id');
        $this->addFilterToMap('purchase_id', 'main_table.purchase_id');
        $this->_init(
            \Digia\AvardaCheckout\Model\PaymentQueue::class,
            \Digia\AvardaCheckout\Model\ResourceModel\PaymentQueue::class
        );
    }
}
