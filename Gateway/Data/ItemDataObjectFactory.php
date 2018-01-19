<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectInterface;

/**
 * Service for creation transferable item object from model
 *
 * @api
 * @since 0.2.0
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
     * Factory constructor
     *
     * @param \Magento\Framework\ObjectManagerInterface $objectManager
     */
    public function __construct(
        \Magento\Framework\ObjectManagerInterface $objectManager
    ) {
        $this->objectManager = $objectManager;
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
            ItemDataObjectInterface::class,
            $data
        );
    }
}
