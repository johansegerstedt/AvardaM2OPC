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
     * @var \Digia\AvardaCheckout\Gateway\Config\Config
     */
    protected $config;

    /**
     * @var \Magento\Checkout\Model\CompositeConfigProvider
     */
    protected $configProvider;

    /**
     * @var \Magento\Checkout\Model\Session
     */
    protected $checkoutSession;

    /**
     * @var \Magento\Quote\Model\QuoteIdMaskFactory
     */
    protected $quoteIdMaskFactory;

    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    protected $assetRepo;

    /**
     * @var array
     */
    protected $jsLayout;

    /**
     * @var CartInterface
     */
    protected $quote;

    /**
     * Checkout constructor.
     *
     * @param Context $context
     * @param \Digia\AvardaCheckout\Gateway\Config\Config $config
     * @param \Magento\Checkout\Model\CompositeConfigProvider $configProvider
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Framework\App\ProductMetadataInterface $productMetadata
     * @param \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory
     * @param array $data = []
     */
    public function __construct(
        Context $context,
        \Digia\AvardaCheckout\Gateway\Config\Config $config,
        \Magento\Checkout\Model\CompositeConfigProvider $configProvider,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Framework\App\ProductMetadataInterface $productMetadata,
        \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->config = $config;
        $this->configProvider = $configProvider;
        $this->checkoutSession = $checkoutSession;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
        $this->assetRepo = $context->getAssetRepository();
        $this->jsLayout = isset($data['jsLayout']) && is_array($data['jsLayout']) ? $data['jsLayout'] : [];

        if ($productMetadata->getEdition() === 'Enterprise') {
            $this->jsLayout = array_merge_recursive([
                "components" => [
                    "gift-card" => [
                        "component" => "Magento_GiftCardAccount/js/view/payment/gift-card-account",
                        "children" => [
                            "errors" => [
                                "sortOrder" => 0,
                                "component" => "Magento_GiftCardAccount/js/view/payment/gift-card-messages",
                                "displayArea" => "messages"
                            ]
                        ]
                    ]
                ]
            ], $this->jsLayout);
        }
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

    /**
     * @return string
     */
    public function getCountryId()
    {
        // TODO;
        return 'FI';
    }

    /**
     * Get AvardaCheckOutClient script path for Require.js.
     *
     * @return string
     */
    public function getCheckOutClientScriptPath()
    {
        return $this->config->getApplicationUrl() . '/Scripts/CheckOutClient';
    }

    /**
     * @return \Magento\Checkout\Model\CompositeConfigProvider
     */
    public function getCheckoutConfig()
    {
        return $this->configProvider->getConfig();
    }

    /**
     * @return string
     */
    public function getPurchaseId()
    {
        return $this->_request->getParam('purchase');
    }

    /**
     * @return string|null
     */
    public function getCustomCssUrl()
    {
        $url = $this->config->getCustomCssUrl();
        if ($url) {
            if (substr($url, 0, 4) === "http") {
                return $url;
            }

            $fullUrl = $this->assetRepo->getUrl($url);
            return $fullUrl;
        }
    }

    /**
     * @return bool
     */
    public function isReplaceDefaultCss()
    {
        return $this->config->isReplaceDefaultCss();
    }

    /**
     * @return string
     */
    public function getSaveOrderUrl()
    {
        return $this->getUrl('avarda/checkout/saveOrder', ['_secure' => true]);
    }

    /**
     * @return string
     */
    public function getCallbackUrl()
    {
        return $this->getUrl('avarda/checkout/process', ['_secure' => true]);
    }

    /**
     * @return string
     */
    public function getJsLayout()
    {
        return json_encode($this->jsLayout);
    }
}
