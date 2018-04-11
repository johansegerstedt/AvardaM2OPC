<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
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
     * @var \Magento\Directory\Helper\Data
     */
    protected $directoryHelper;

    /**
     * @var \Magento\Quote\Model\QuoteIdMaskFactory
     */
    protected $quoteIdMaskFactory;

    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    protected $assetRepo;

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
     * @param \Magento\Directory\Helper\Data $directoryHelper
     * @param \Magento\Framework\App\ProductMetadataInterface $productMetadata
     * @param \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory
     * @param array $data = []
     */
    public function __construct(
        Context $context,
        \Digia\AvardaCheckout\Gateway\Config\Config $config,
        \Magento\Checkout\Model\CompositeConfigProvider $configProvider,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Directory\Helper\Data $directoryHelper,
        \Magento\Framework\App\ProductMetadataInterface $productMetadata,
        \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->config = $config;
        $this->configProvider = $configProvider;
        $this->checkoutSession = $checkoutSession;
        $this->directoryHelper = $directoryHelper;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
        $this->assetRepo = $context->getAssetRepository();

        if ($productMetadata->getEdition() === 'Enterprise') {
            $this->jsLayout = array_merge_recursive([
                'components' => [
                    'gift-card' => [
                        'component' => 'Magento_GiftCardAccount/js/view/payment/gift-card-account',
                        'children' => [
                            'errors' => [
                                'sortOrder' => 0,
                                'component' => 'Magento_GiftCardAccount/js/view/payment/gift-card-messages',
                                'displayArea' => 'messages'
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
     * @return int|null
     */
    public function getMaskedQuoteId()
    {
        return $this->quoteIdMaskFactory->create()->load(
            $this->getQuoteId(),
            'quote_id'
        )->getMaskedId();
    }

    /**
     * @return int|null
     */
    public function getCustomerId()
    {
        return (int) $this->getQuote()->getCustomerId();
    }

    /**
     * @return int|null
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
        return $this->directoryHelper->getDefaultCountry();
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
            if (0 === strpos($url, 'http')) {
                return $url;
            }

            return $this->assetRepo->getUrl($url);
        }
        
        return null;
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
    public function getProductPlaceholderUrl()
    {
        return $this->getViewFileUrl('Magento_Catalog::images/product/placeholder/thumbnail.jpg');
    }
}
