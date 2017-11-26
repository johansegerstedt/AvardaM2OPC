<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Block;

use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Quote\Api\Data\CartInterface;

class Checkout extends Template
{
    /**
     * @var \Magento\Checkout\Model\Session
     */
    protected $checkoutSession;

    /**
     * @var \Magento\Quote\Model\QuoteIdMaskFactory
     */
    protected $quoteIdMaskFactory;

    /**
     * @var CartInterface
     */
    protected $quote;

    /**
     * Checkout constructor.
     *
     * @param Context $context
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory
     * @param array $data
     */
    public function __construct(
        Context $context,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->checkoutSession = $checkoutSession;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
    }

    /**
     * @return string
     */
    public function getBaseMediaUrl()
    {
        return $this->_storeManager->getStore()
            ->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
    }

    /**
     * @return integer|null
     */
    public function getMaskedQuoteId()
    {
        return $this->quoteIdMaskFactory->create()->load(
            $this->getQuoteId(),
            'quote_id'
        )->getMaskedId();
    }

    /**
     * @return integer|null
     */
    public function getCustomerId()
    {
        return $this->getQuote()->getCustomerId();
    }

    /**
     * @return integer|null
     */
    public function getQuoteId()
    {
        return $this->getQuote()->getId();
    }

    /**
     * @return array
     */
    public function getItems()
    {
        $items = $this->getQuote()->getItems();
        $data = [];

        foreach ($items as $key => $item) {
            $itemData = [
                'qty' => $item->getQty(),
                'name' => $item->getName(),
                'price' => $item->getPrice(),
                'sku' => $item->getSku(),
                'total' => $item->getBaseRowTotalInclTax(),
                'url' => $item->getRedirectUrl(),
                'priceInclTax' => $item->getBasePriceInclTax()
            ];
            $data[] = $itemData;
        }

        return $data;
    }

    /**
     * @return bool
     */
    public function hasItems()
    {
        return $this->getQuote()->hasItems();
    }

    /**
     * @return CartInterface
     */
    protected function getQuote()
    {
        if (!isset($this->quote)) {
            $this->quote = $this->checkoutSession->getQuote();
        }

        return $this->quote;
    }
}
