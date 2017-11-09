<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Magento\Payment\Gateway\Request\BuilderInterface;

/**
 * Class AmountDataBuilder
 */
class ItemsDataBuilder implements BuilderInterface
{
    /**
     * The amount to add to the payment
     */
    const ITEMS = 'Items';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        return [self::ITEMS => [

        ]];
    }
}
