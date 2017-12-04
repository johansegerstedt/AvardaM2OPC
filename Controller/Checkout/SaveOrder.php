<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Controller\Checkout;

use \Magento\Framework\App\Action\Action;

class SaveOrder extends Action
{
    /**
     * @var \Magento\Checkout\Model\Session
     */
    protected $checkoutSession;

    /**
     * @var \Magento\Customer\Model\Session
     */
    protected $customerSession;

    /**
     * @var \Digia\AvardaCheckout\Api\GuestPaymentManagementInterface
     */
    protected $guestPaymentManagement;

    /**
     * @var \Digia\AvardaCheckout\Api\PaymentManagementInterface
     */
    protected $paymentManagement;

    /**
     * Index constructor.
     *
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Customer\Model\Session $customerSession
     * @param \Digia\AvardaCheckout\Api\GuestPaymentManagementInterface $guestPaymentManagement
     * @param \Digia\AvardaCheckout\Api\PaymentManagementInterface $paymentManagement
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Customer\Model\Session $customerSession,
        \Digia\AvardaCheckout\Api\GuestPaymentManagementInterface $guestPaymentManagement,
        \Digia\AvardaCheckout\Api\PaymentManagementInterface $paymentManagement
    ) {
        parent::__construct($context);
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->guestPaymentManagement = $guestPaymentManagement;
        $this->paymentManagement = $paymentManagement;
    }

    /**
     * Order success action
     *
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        $cartId = $this->checkoutSession->getAvardaCartId();
        if (!$this->customerSession->isLoggedIn()) {
            $this->guestPaymentManagement->updateAndPlaceOrder($cartId);
        } else {
            $this->paymentManagement->updateAndPlaceOrder($cartId);
        }

        return $this->resultRedirectFactory->create()->setPath(
            'checkout/onepage/success'
        );
    }
}
