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
    public function create($data)
    {
        if (array_key_exists('item', $data) &&
            array_key_exists('qty', $data) &&
            array_key_exists('amount', $data) &&
            array_key_exists('tax_amount', $data)
        ) {
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
