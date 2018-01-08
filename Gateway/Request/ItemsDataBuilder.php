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
use Magento\Payment\Helper\Formatter;

/**
 * Class AmountDataBuilder
 */
class ItemsDataBuilder implements BuilderInterface
{
    use Formatter;

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
     * ItemsDataBuilder constructor.
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

        $items[self::ITEMS] = [];
        foreach ($order->getItems() as $item) {
            if (!$item->getProductId() ||
                $item->hasParentItemId() ||
                $item->isDeleted()
            ) {
                continue;
            }

            $items[self::ITEMS][] = $this->prepareItemObject($item);
        }

        return $items;
    }

    /**
     * @param mixed $item of the quote, order, invoice or credit memo
     * @return \StdClass
     */
    public function prepareItemObject($item)
    {
        $itemDO = $this->itemDataObjectFactory->create($item);

        $itemSubject['item'] = $itemDO;
        $itemSubject['amount'] = $this->formatPrice(
            $item->getRowTotalInclTax() - $item->getDiscountAmount()
        );
        $itemSubject['tax_amount'] = $this->formatPrice(
            $item->getTaxAmount()
            + $item->getHiddenTaxAmount()
            + $item->getWeeeTaxAppliedAmount()
        );

        return (object) $this->itemBuilder->build($itemSubject);
    }
}
