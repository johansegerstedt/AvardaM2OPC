<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectFactoryInterface;
use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectInterface;
use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;

/**
 * Class AmountDataBuilder
 */
class ShippingItemDataBuilder implements BuilderInterface
{
    /**
     * The amount to add to the payment
     */
    const ITEMS = 'Items';

    /**
     * @var ItemDataObjectFactoryInterface
     */
    protected $itemDataObjectFactory;

    /**
     * @var BuilderInterface
     */
    protected $itemBuilder;

    public function __construct(
        ItemDataObjectFactoryInterface $itemDataObjectFactory,
        BuilderInterface $itemBuilder
    ) {
        $this->itemDataObjectFactory = $itemDataObjectFactory;
        $this->itemBuilder = $itemBuilder;
    }

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        $paymentDO = SubjectReader::readPayment($buildSubject);

        $order = $paymentDO->getOrder();
        $itemDO = $this->itemDataObjectFactory->create($order);

        $itemSubject['item'] = $itemDO;
        $itemSubject['amount'] = $order->getShippingAmount();
        $itemSubject['tax_amount'] = $order->getShippingTaxAmount();

        return [
            self::ITEMS => [
                (object) $this->itemBuilder->build($itemSubject)
            ]
        ];
    }
}
