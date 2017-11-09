<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Digia\AvardaCheckout\Gateway\Helper\ItemSubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;

/**
 * Class ProductDataBuilder
 */
class ProductDataBuilder implements BuilderInterface
{
    /**
     * String (max. 35 characters)
     */
    const DESCRIPTION = 'Description';

    /**
     * String (max. 35 characters)
     */
    const NOTES = 'Notes';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        $item = ItemSubjectReader::readItem($buildSubject)->getItem();

        return [
            self::DESCRIPTION => $item->getName(),
            self::NOTES => $item->getSku(),
        ];
    }
}
