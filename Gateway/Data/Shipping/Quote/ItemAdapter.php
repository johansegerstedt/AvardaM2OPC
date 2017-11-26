<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Data\Shipping\Quote;

use Digia\AvardaCheckout\Gateway\Data\ItemAdapterInterface;
use Magento\Payment\Gateway\Data\OrderAdapterInterface;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Api\CartTotalRepositoryInterface;

/**
 * Class ItemAdapter
 */
class ItemAdapter implements ItemAdapterInterface
{
    /**
     * @var OrderAdapterInterface
     */
    protected $quote;

    /**
     * @var CartRepositoryInterface
     */
    protected $quoteRepository;

    /**
     * @var CartTotalRepositoryInterface
     */
    protected $quoteTotalRepository;

    /**
     * @var \Magento\Quote\Api\Data\AddressInterface
     */
    protected $shippingAddress;

    /**
     * @var \Magento\Quote\Api\Data\TotalsInterface
     */
    protected $totals;

    /**
     * ItemAdapter constructor.
     *
     * @param OrderAdapterInterface $quote
     * @param CartRepositoryInterface $quoteRepository
     * @param CartTotalRepositoryInterface $quoteTotalRepository
     */
    public function __construct(
        OrderAdapterInterface $quote,
        CartRepositoryInterface $quoteRepository,
        CartTotalRepositoryInterface $quoteTotalRepository

    ) {
        $this->quote = $quote;
        $this->quoteRepository = $quoteRepository;
        $this->quoteTotalRepository = $quoteTotalRepository;
    }

    /**
     * Get product ID
     *
     * @return integer|null
     */
    public function getProductId()
    {
        return null;
    }

    /**
     * Get parent item ID
     *
     * @return integer|null
     */
    public function getParentItemId()
    {
        return null;
    }

    /**
     * Get the item product name
     *
     * @return string
     */
    public function getName()
    {
        return $this->getShippingAddress()->getShippingDescription();
    }

    /**
     * Get the item SKU
     *
     * @return string
     */
    public function getSku()
    {
        return $this->getShippingAddress()->getShippingMethod();
    }

    /**
     * Get additional data
     *
     * @return string
     */
    public function getAdditionalData()
    {
        // TODO: shipping stuff
    }

    /**
     * Get product type
     *
     * @return string
     */
    public function getProductType()
    {
        return 'shipping';
    }

    /**
     * Get tax amount
     *
     * @return float
     */
    public function getTaxAmount()
    {
        return $this->getTotals()->getShippingTaxAmount();
    }

    /**
     * Get tax percent/code
     *
     * @return float
     */
    public function getTaxPercent()
    {
        // TODO: Load tax percent from admin
        return 0.0;
    }

    /**
     * Get row total
     *
     * @return float
     */
    public function getRowTotal()
    {
        return $this->getTotals()->getShippingAmount();
    }

    /**
     * Get row total including tax
     *
     * @return float
     */
    public function getRowTotalInclTax()
    {
        return $this->getTotals()->getShippingInclTax();
    }

    /**
     * @return \Magento\Quote\Api\Data\AddressInterface
     */
    protected function getShippingAddress()
    {
        if (!isset($this->shippingAddress)) {
            $entityId = $this->quote->getId();
            $quote = $this->quoteRepository->get($entityId);
            $this->shippingAddress = $quote->getShippingAddress();
        }

        return $this->shippingAddress;
    }

    /**
     * @return \Magento\Quote\Api\Data\TotalsInterface
     */
    protected function getTotals()
    {
        if (!isset($this->totals)) {
            $entityId = $this->quote->getId();
            $this->totals = $this->quoteTotalRepository->get($entityId);
        }

        return $this->totals;
    }
}
