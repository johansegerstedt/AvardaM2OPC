<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request\Item;

use Digia\AvardaCheckout\Gateway\Helper\ItemSubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;
use Magento\Payment\Helper\Formatter;

/**
 * Class TaxDataBuilder
 */
class TaxDataBuilder implements BuilderInterface
{
    use Formatter;

    /**
     * String
     */
    const TAX_CODE = 'TaxCode';

    /**
     * Decimal
     */
    const TAX_AMOUNT = 'TaxAmount';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        $item = ItemSubjectReader::readItem($buildSubject);
        $taxAmount = ItemSubjectReader::readTaxAmount($buildSubject);

        return [
            self::TAX_CODE => $item->getTaxPercent(),
            self::TAX_AMOUNT => $this->formatPrice($taxAmount),
        ];
    }
}
