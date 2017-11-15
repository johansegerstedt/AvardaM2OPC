<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

use Magento\Quote\Api\Data\CartItemInterface;
use Magento\Sales\Api\Data\CreditmemoItemInterface;
use Magento\Sales\Api\Data\InvoiceItemInterface;
use Magento\Sales\Api\Data\OrderItemInterface;

/**
 * Service for creation transferable item object from model
 *
 * @api
 * @since 100.0.2
 */
class ItemDataObjectFactory implements ItemDataObjectFactoryInterface
{
    /**
     * Object Manager instance
     *
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var Order\ItemAdapterFactory
     */
    private $orderAdapterFactory;

    /**
     * @var Quote\ItemAdapterFactory
     */
    private $quoteAdapterFactory;

    /**
     * Factory constructor
     *
     * @param \Magento\Framework\ObjectManagerInterface $objectManager
     * @param Order\ItemAdapterFactory $orderAdapterFactory
     * @param Quote\ItemAdapterFactory $quoteAdapterFactory
     */
    public function __construct(
        \Magento\Framework\ObjectManagerInterface $objectManager,
        Order\ItemAdapterFactory $orderItemAdapterFactory,
        Quote\ItemAdapterFactory $quoteItemAdapterFactory
    ) {
        $this->objectManager = $objectManager;
        $this->orderItemAdapterFactory = $orderItemAdapterFactory;
        $this->quoteItemAdapterFactory = $quoteItemAdapterFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function create($item)
    {
        if ($item instanceof InvoiceItemInterface ||
            $item instanceof CreditmemoItemInterface
        ) {
            $orderItem = $item->getOrderItem();
            $data['item'] = $this->orderItemAdapterFactory->create(
                ['orderItem' => $orderItem]
            );
        } elseif ($item instanceof OrderItemInterface) {
            $data['item'] = $this->orderItemAdapterFactory->create(
                ['orderItem' => $item]
            );
        } elseif ($item instanceof CartItemInterface) {
            $data['item'] = $this->quoteItemAdapterFactory->create(
                ['quoteItem' => $item]
            );
        }

        if (!isset($data)) {
            throw new \Magento\Payment\Gateway\Command\CommandException(
                __('Failed to build item data.')
            );
        }

        return $this->objectManager->create(
            \Digia\AvardaCheckout\Gateway\Data\ItemDataObjectInterface::class,
            $data
        );
    }
}
