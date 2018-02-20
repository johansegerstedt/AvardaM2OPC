<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Block;

use Digia\AvardaCheckout\Gateway\Config\Config;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;
use Magento\Quote\Api\Data\CartInterface;
use Magento\Checkout\Block\Onepage;

class Checkout extends Onepage
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
     * @var Config
     */
    protected $config;

    /**
     * @var \Magento\Framework\View\Asset\Repository
     */
    protected $assetRepo;

    /**
     * Checkout constructor.
     *
     * @param Context $context
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory
     * @param Config
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Framework\Data\Form\FormKey $formKey,
        \Magento\Checkout\Model\CompositeConfigProvider $configProvider,
        array $layoutProcessors = [],
        array $data = [],
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory,
        Config $config,
        \Magento\Framework\App\ProductMetadataInterface $productMetadata
    ) {
        parent::__construct($context, $formKey, $configProvider, $layoutProcessors, $data);
        $this->checkoutSession = $checkoutSession;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
        $this->config = $config;
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
     * @return string
     */
    public function getPurchaseId() {
        return $this->_request->getParam('purchase');
    }
    /**
     * @return string|null
     */
    public function getCustomCssUrl()
    {
      $url = $this->config->getCustomCssUrl();
      if ($url) {
          if(substr( $url, 0, 4 ) === "http"){
              return $url;
          }
          $fullUrl = $this->assetRepo->getUrl($url);
          return $fullUrl;
      }
    }

    public function getReplaceDefaultCss()
    {
      return $this->config->getReplaceDefaultCss();
    }

    /**
     * @return string
     */
    public function getSaveOrderUrl() {
        return $this->getUrl('avarda/checkout/saveOrder', ['_secure' => true]);
    }

    /**
     * @return string
     */
    public function getCallbackUrl() {
        return $this->getUrl('avarda/checkout/process', ['_secure' => true]);
    }

    public function getJsLayout() {
      $writer = new \Zend\Log\Writer\Stream(BP . '/var/log/test.log');
      $logger = new \Zend\Log\Logger();
      $logger->addWriter($writer);
      $logger->info('Your text message');
      //$logger->info(print_r($this->layoutProcessors, true));
      foreach ($this->layoutProcessors as $processor) {
            $logger->info('---');
            $logger->info(print_r($this->jsLayout, true));
            if (!isset($this->jsLayout)) {
              exit;
              // return;
            }
            $logger->info('Processing...');
            // $this->jsLayout = $processor->process($this->jsLayout);
        }
        $logger->info('^^^');
        return \Zend_Json::encode($this->jsLayout);
    }
}
