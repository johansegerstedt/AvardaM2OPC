<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Helper;

use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectInterface;

/**
 * This class encapsulates implicit interfaces (array structures) used in payments implementation.
 * This type of class was introduced for backward compatibility with legacy implementation according to Magento 2 core.
 *
 * @api
 * @since 100.0.2
 */
class ItemSubjectReader
{
    /**
     * Reads item from subject
     *
     * @param array $subject
     * @return ItemDataObjectInterface
     */
    public static function readItem(array $subject)
    {
        if (!isset($subject['item'])
            || !$subject['item'] instanceof ItemDataObjectInterface
        ) {
            throw new \InvalidArgumentException('Item data object should be provided');
        }

        return $subject['item'];
    }

    /**
     * Reads amount from subject
     *
     * @param array $subject
     * @return mixed
     */
    public static function readAmount(array $subject)
    {
        if (!isset($subject['amount']) || !is_numeric($subject['amount'])) {
            throw new \InvalidArgumentException('Amount should be provided');
        }

        return $subject['amount'];
    }
}
