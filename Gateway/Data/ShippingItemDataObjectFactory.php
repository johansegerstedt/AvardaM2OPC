<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

use Magento\Payment\Gateway\Data\OrderAdapterInterface;

/**
 * Service for creation transferable item object from model
 *
 * @api
 * @since 100.0.2
 */
class ShippingItemDataObjectFactory implements ItemDataObjectFactoryInterface
{
    /**
     * Object Manager instance
     *
     * @var \Magento\Framework\ObjectManagerInterface
     */
    private $objectManager;

    /**
     * @var ShippingItemAdapter
     */
    private $shippingItemAdapterFactory;

    /**
     * Factory constructor
     *
     * @param \Magento\Framework\ObjectManagerInterface $objectManager
     * @param ShippingItemAdapter $shippingItemAdapterFactory
     */
    public function __construct(
        \Magento\Framework\ObjectManagerInterface $objectManager,
        ShippingItemAdapter $shippingItemAdapterFactory
    ) {
        $this->objectManager = $objectManager;
        $this->shippingItemAdapterFactory = $shippingItemAdapterFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function create($order)
    {
        if ($order instanceof OrderAdapterInterface) {
            $data['item'] = $this->shippingItemAdapterFactory->create(
                ['order' => $order]
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
