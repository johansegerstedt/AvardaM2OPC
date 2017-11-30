<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Controller\Checkout;

use \Magento\Framework\App\Action\Action;

class Index extends Action
{
    const CALLBACK_FAILURE = 'Failure';
    const CALLBACK_SUCCESS = 'Success';

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * @var \Magento\Checkout\Helper\Data
     */
    protected $checkoutHelper;

    /**
     * @var \Magento\Customer\Model\Session
     */
    protected $customerSession;

    /**
     * @var \Magento\Checkout\Model\Session
     */
    protected $checkoutSession;

    /**
     * @var \Digia\AvardaCheckout\Gateway\Config\Config
     */
    protected $config;

    /**
     * Index constructor.
     *
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Magento\Framework\View\Result\PageFactory $resultPageFactory
     * @param \Magento\Checkout\Helper\Data $checkoutHelper
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Customer\Model\Session $customerSession
     * @param \Digia\AvardaCheckout\Gateway\Config\Config $config
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Checkout\Helper\Data $checkoutHelper,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Customer\Model\Session $customerSession,
        \Digia\AvardaCheckout\Gateway\Config\Config $config
    ) {
        parent::__construct($context);
        $this->resultPageFactory = $resultPageFactory;
        $this->checkoutHelper = $checkoutHelper;
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->config = $config;
    }

    /**
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        if ($this->isCallback()) {
            return $this->resultRedirectFactory->create()->setPath(
                'avarda/checkout/saveOrder'
            );
        }

        if (!$this->config->isActive()) {
            $this->messageManager->addErrorMessage(
                __('Avarda checkout is turned off.')
            );
            return $this->resultRedirectFactory->create()->setPath('checkout/cart');
        }

        // Check if quote is valid, otherwise return to cart.
        $quote = $this->checkoutSession->getQuote();
        if (!$quote->hasItems() ||
            $quote->getHasError() ||
            !$quote->validateMinimumAmount()
        ) {
            return $this->resultRedirectFactory->create()->setPath('checkout/cart');
        }

        if (!$this->customerSession->isLoggedIn() &&
            !$this->checkoutHelper->isAllowedGuestCheckout($quote)
        ) {
            $this->messageManager->addErrorMessage(
                __('Guest checkout is disabled.')
            );
            return $this->resultRedirectFactory->create()->setPath('checkout/cart');
        }

        $this->customerSession->regenerateId();
        $this->checkoutSession->setCartWasUpdated(false);

        $resultPage = $this->resultPageFactory->create();
        $resultPage->getConfig()->getTitle()->set(__('Checkout'));
        return $resultPage;
    }

    /**
     * Check if the URL is a callback.
     *
     * @return bool
     */
    public function isCallback()
    {
        return (
            (bool) $this->_request->getParam('callback', false) == true ||
            $this->_request->getParam(
                'PaymentStatus',
                self::CALLBACK_FAILURE
            ) == self::CALLBACK_SUCCESS
        );
    }
}
