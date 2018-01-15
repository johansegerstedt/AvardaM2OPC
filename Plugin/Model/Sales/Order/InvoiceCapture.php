<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Plugin\Model\Sales\Order;

use Magento\Sales\Api\Data\InvoiceInterface;
use Digia\AvardaCheckout\Gateway\Data\ItemDataObjectInterface;
use Digia\AvardaCheckout\Api\ItemStorageInterface;
use Digia\AvardaCheckout\Gateway\Data\Shipping\ItemDataObjectFactory;

class InvoiceCapture
{
    /**
     * @var \Psr\Log\LoggerInterface $logger
     */
    protected $logger;

    /**
     * @var ItemStorageInterface
     */
    protected $itemStorage;

    /**
     * @var ItemDataObjectFactory
     */
    protected $itemDataObjectFactory;

    /**
     * @var \Digia\AvardaCheckout\Gateway\Config\Config
     */
    protected $config;

    /**
     * CollectTotals constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param ItemStorageInterface $itemStorage
     * @param ItemDataObjectFactory $itemDataObjectFactory
     * @param \Digia\AvardaCheckout\Gateway\Config\Config $config
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        ItemStorageInterface $itemStorage,
        ItemDataObjectFactory $itemDataObjectFactory,
        \Digia\AvardaCheckout\Gateway\Config\Config $config
    ) {
        $this->logger = $logger;
        $this->itemStorage = $itemStorage;
        $this->itemDataObjectFactory = $itemDataObjectFactory;
        $this->config = $config;
    }

    /**
     * @param InvoiceInterface $subject
     * @return void
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function beforeCapture(InvoiceInterface $subject)
    {
        try {
            if ($this->config->isActive()) {
                $items = [];
                foreach ($subject->getItems() as $item) {
                    $items[] = $item;
                }
                $this->prepareShipment($subject, $items);
                $this->itemStorage->setItems($items);
            }
        } catch (\Exception $e) {
            $this->logger->error($e);
        }
    }

    /**
     * @param InvoiceInterface $subject
     * @param array $items
     * @return array
     */
    protected function prepareShipment(InvoiceInterface $subject, array $items)
    {
        if ($subject->getShippingInclTax() === null) {
            return $items;
        }

        $order = $subject->getOrder();
        $shipmentData = [
            'name' => $order->getShippingDescription(),
            'sku' => $order->getShippingMethod(),
            'tax_amount' => $subject->getShippingTaxAmount(),
            'row_total' => $subject->getShippingAmount(),
            'row_total_incl_tax' => $subject->getShippingInclTax(),
        ];

        $items[] = $this->itemDataObjectFactory->create([
            'data' => $shipmentData,
        ]);

        return $items;
    }
}
