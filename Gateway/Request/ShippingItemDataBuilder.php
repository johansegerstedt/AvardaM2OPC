<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectFactoryInterface;
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

    /**
     * ShippingItemDataBuilder constructor.
     *
     * @param ItemDataObjectFactoryInterface $itemDataObjectFactory
     * @param BuilderInterface $itemBuilder
     */
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
        $result = [];

        $shippingAddress = $order->getShippingAddress();
        if ($shippingAddress) {
            $itemDO = $this->itemDataObjectFactory->create($order);
            $item = $itemDO->getItem();

            $itemSubject['item'] = $itemDO;
            $itemSubject['amount'] = $item->getRowTotalInclTax();
            $itemSubject['tax_amount'] = $item->getTaxAmount();

            $result[self::ITEMS][10000] = (object) $this->itemBuilder->build($itemSubject);
        }

        return $result;
    }
}
