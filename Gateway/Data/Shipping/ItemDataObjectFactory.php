<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data\Shipping;

use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectFactoryInterface;
use Magento\Payment\Gateway\Data\OrderAdapterInterface;

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
     * @var Quote\ItemAdapterFactory
     */
    private $quoteItemAdapterFactory;

    /**
     * Factory constructor
     *
     * @param \Magento\Framework\ObjectManagerInterface $objectManager
     * @param Quote\ItemAdapterFactory $itemAdapterFactory
     */
    public function __construct(
        \Magento\Framework\ObjectManagerInterface $objectManager,
        Quote\ItemAdapterFactory $quoteItemAdapterFactory
    ) {
        $this->objectManager = $objectManager;
        $this->quoteItemAdapterFactory = $quoteItemAdapterFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function create($order)
    {
        if ($order instanceof OrderAdapterInterface) {
            $data['item'] = $this->quoteItemAdapterFactory->create(
                ['quote' => $order]
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
