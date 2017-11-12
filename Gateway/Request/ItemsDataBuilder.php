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
class ItemsDataBuilder implements BuilderInterface
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
        $items[self::ITEMS] = [];
        foreach ($order->getItems() as $item) {
            $items[self::ITEMS][] = $this->prepareItemObject($item);
        }

        return $items;
    }

    /**
     * @param CartItemInterface|OrderItemInterface $item of the quote or order
     * @return \StdClass
     */
    public function prepareItemObject($item)
    {
        $itemDO = $this->itemDataObjectFactory->create($item);

        $itemSubject['item'] = $itemDO;
        $itemSubject['amount'] = $item->getRowTotalInclTax();
        $itemSubject['tax_amount'] = $item->getTaxAmount();

        return (object) $this->itemBuilder->build($itemSubject);
    }
}
