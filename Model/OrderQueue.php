<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

/**
 * Order queue model
 */
class Queue extends \Magento\Framework\Model\AbstractModel
{
    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        parent::_construct();
        $this->_init('Digia\AvardaCheckout\Model\ResourceModel\OrderQueue');
    }
}
