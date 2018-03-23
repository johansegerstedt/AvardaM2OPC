<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model\Data;

use Digia\AvardaCheckout\Api\Data\ItemDetailsListInterface;
use Digia\AvardaCheckout\Api\Data\ItemDetailsInterface;
use Magento\Framework\Model\AbstractExtensibleModel;

/**
 * @codeCoverageIgnoreStart
 */
class ItemDetailsList extends AbstractExtensibleModel implements
    ItemDetailsListInterface
{
    /**
     * {@inheritdoc}
     */
    public function getItems()
    {
        if (!$this->hasData(self::ITEMS)) {
            return [];
        }

        return $this->getData(self::ITEMS);
    }

    /**
     * {@inheritdoc}
     */
    public function setItems($items)
    {
        if (!is_array($items)) {
            return $this->setData(self::ITEMS, [$items]);
        }

        return $this->setData(self::ITEMS, $items);
    }

    /**
     * {@inheritdoc}
     */
    public function addItem(ItemDetailsInterface $item)
    {
        $items = $this->getItems();
        $items[] = $item;

        return $this->setData(self::ITEMS, $items);
    }
}
