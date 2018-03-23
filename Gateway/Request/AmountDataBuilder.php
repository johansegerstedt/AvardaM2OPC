<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;
use Magento\Payment\Helper\Formatter;

/**
 * Class AmountDataBuilder
 */
class AmountDataBuilder implements BuilderInterface
{
    use Formatter;

    /**
     * The amount to add to the payment
     */
    const AMOUNT = 'Amount';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        return [
            self::AMOUNT => $this->formatPrice(
                SubjectReader::readAmount($buildSubject)
            ),
        ];
    }
}
