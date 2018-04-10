<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request\Item;

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
        $item = ItemSubjectReader::readItem($buildSubject);

        return [
            self::DESCRIPTION => mb_substr($item->getName(), 0, 35),
            self::NOTES => mb_substr($item->getSku(), 0, 35),
        ];
    }
}
