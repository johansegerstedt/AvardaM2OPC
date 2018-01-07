<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterface;
use Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory;
use Digia\AvardaCheckout\Api\PaymentManagementInterface;
use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Magento\Framework\Exception\PaymentException;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class PaymentManagement implements PaymentManagementInterface
{
    /**
     * @var \Psr\Log\LoggerInterface
     */
    protected $logger;

    /**
     * @var PaymentDetailsInterfaceFactory
     */
    protected $paymentDetailsFactory;

    /**
     * @var QuotePaymentManagementInterface
     */
    protected $quotePaymentManagement;

    /**
     * @var \Magento\Checkout\Model\Session
     */
    protected $checkoutSession;

    /**
     * @var \Magento\Quote\Api\CartManagementInterface
     */
    protected $cartManagement;

    /**
     * GuestPaymentManagement constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param PaymentDetailsInterfaceFactory $paymentDetailsFactory
     * @param QuotePaymentManagementInterface $quotePaymentManagement
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Quote\Api\CartManagementInterface $cartManagement
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        PaymentDetailsInterfaceFactory $paymentDetailsFactory,
        QuotePaymentManagementInterface $quotePaymentManagement,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Quote\Api\CartManagementInterface $cartManagement
    ) {
        $this->logger = $logger;
        $this->paymentDetailsFactory = $paymentDetailsFactory;
        $this->quotePaymentManagement = $quotePaymentManagement;
        $this->checkoutSession = $checkoutSession;
        $this->quotePaymentManagement = $cartManagement;
    }

    /**
     * {@inheritdoc}
     */
    public function getPurchaseId($cartId)
    {
        try {
            $purchaseId = $this->quotePaymentManagement->getPurchaseId($cartId);

            /** @var PaymentDetailsInterface $paymentDetails */
            $paymentDetails = $this->paymentDetailsFactory->create();
            $paymentDetails->setPurchaseId($purchaseId);
            return $paymentDetails;
        } catch (\Digia\AvardaCheckout\Exception\BadRequestException $e) {
            $this->logger->error($e);

            throw new PaymentException(__($e->getMessage()));
        } catch (\Exception $e) {
            $this->logger->error($e);

            throw new PaymentException(
                __('Failed to load Avarda payment. Please try again later.')
            );
        }
    }

    /**
     * {@inheritdoc}
     */
    public function freezeCart($cartId)
    {
        try {
            $this->quotePaymentManagement->freezeCart($cartId);
            $this->checkoutSession->setAvardaCartId($cartId);
        } catch (\Digia\AvardaCheckout\Exception\BadRequestException $e) {
    }

    /**
     * {@inheritdoc}
     */
    public function getItemDetailsList($cartId)
    {
        try {
            return $this->quotePaymentManagement->getItemDetailsList($cartId);
        } catch (\Digia\AvardaCheckout\Exception\BadRequestException $e) {
            $this->logger->error($e);

            throw new PaymentException(__($e->getMessage()));
        } catch (\Exception $e) {
            $this->logger->error($e);

            throw new PaymentException(
                __('Something went wrong with Avarda checkout. Please try again later.')
            );
        }
    }

    /**
     * {@inheritdoc}
     */
    public function updateAndPlaceOrder($cartId)
    {
        try {
            $this->quotePaymentManagement->updatePaymentStatus($cartId);

            // Unfreeze cart before placing the order
            $this->quotePaymentManagement->unfreezeCart($cartId);

            // Place order from updated quote
            $this->cartManagement->placeOrder($cartId);
        } catch (\Exception $e) {

            // Freeze cart again if place order failed
            $this->freezeCart($cartId);
            $this->logger->error($e);

            throw new PaymentException(
                __('Failed to save Avarda order. Please try again later.')
            );
        }
    }
}
