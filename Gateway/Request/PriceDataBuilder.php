<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Magento\Payment\Gateway\Request\BuilderInterface;
use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Helper\Formatter;

/**
 * Class AmountDataBuilder
 */
class PriceDataBuilder extends AmountDataBuilder
{
    /**
     * The amount to add to the payment
     */
    const AMOUNT = 'Price';
}
