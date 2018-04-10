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
 * Class PriceDataBuilder
 */
class PriceDataBuilder implements BuilderInterface
{
    use Formatter;

    /**
     * The price to add to the payment
     */
    const PRICE = 'Price';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        return [
            self::PRICE => $this->formatPrice(
                SubjectReader::readAmount($buildSubject)
            ),
        ];
    }
}
