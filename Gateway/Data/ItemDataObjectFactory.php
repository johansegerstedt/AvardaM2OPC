<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data;

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
    public function create(
        ItemAdapterInterface $item,
        $qty,
        $amount,
        $taxAmount
    ) {
        return $this->objectManager->create(
            ItemDataObjectInterface::class,
            [
                'item' => $item,
                'qty' => $qty,
                'amount' => $amount,
                'taxAmount' => $taxAmount,
            ]
        );
    }
}
