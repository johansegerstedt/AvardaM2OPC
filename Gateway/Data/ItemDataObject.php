<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

class ItemDataObject implements ItemDataObjectInterface
{
    /**
     * @var ItemAdapterInterface
     */
    protected $item;

    /**
     * @var float
     */
    protected $qty;

    /**
     * @var float
     */
    protected $amount;

    /**
     * @var float
     */
    protected $taxAmount;

    /**
     * @param ItemAdapterInterface $item
     * @param float $qty
     * @param float $amount
     * @param float $taxAmount
     */
    public function __construct(
        ItemAdapterInterface $item,
        $qty,
        $amount,
        $taxAmount
    ) {
        $this->item = $item;
        $this->qty = $qty;
        $this->amount = $amount;
        $this->taxAmount = $taxAmount;
    }

    /**
     * @inheritdoc
     */
    public function getItem()
    {
        return $this->item;
    }

    /**
     * @inheritdoc
     */
    public function getSubject()
    {
        return [
            'item' => $this->getItem(),
            'qty' => $this->qty,
            'amount' => $this->amount,
            'tax_amount' => $this->taxAmount,
        ];
    }
}
