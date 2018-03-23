<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Digia\AvardaCheckout\Api\ItemStorageInterface;
use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectInterface;
use Magento\Framework\Exception\PaymentException;
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
     * @var ItemStorageInterface
     */
    protected $itemStorage;

    /**
     * @var BuilderInterface
     */
    protected $itemBuilder;

    /**
     * ItemsDataBuilder constructor.
     *
     * @param ItemStorageInterface $itemStorage
     * @param BuilderInterface $itemBuilder
     */
    public function __construct(
        ItemStorageInterface $itemStorage,
        BuilderInterface $itemBuilder
    ) {
        $this->itemStorage = $itemStorage;
        $this->itemBuilder = $itemBuilder;
    }

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        $preparedItems = $this->itemStorage->getItems();
        if (count($preparedItems) === 0) {
            throw new PaymentException(
                __('Could not generate items for Avarda checkout.')
            );
        }

        $items[self::ITEMS] = [];
        foreach ($preparedItems as $preparedItem) {
            if (!$preparedItem instanceof ItemDataObjectInterface) {
                throw new PaymentException(
                    __('Could not generate items for Avarda checkout.')
                );
            }

            $items[self::ITEMS][] = (object) $this->itemBuilder->build(
                $preparedItem->getSubject()
            );
        }

        return $items;
    }
}
