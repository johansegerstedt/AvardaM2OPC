<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\GuestPaymentManagementInterface;
use Magento\Framework\Exception\PaymentException;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class GuestPaymentManagement implements GuestPaymentManagementInterface
{
    /**
     * @var \Psr\Log\LoggerInterface
     */
    protected $logger;

    /**
     * @var \Digia\AvardaCheckout\Api\QuotePaymentManagementInterface
     */
    protected $quotePaymentManagement;

    /**
     * @var \Magento\Checkout\Model\Session
     */
    protected $checkoutSession;

    /**
     * @var \Magento\Quote\Api\GuestCartManagementInterface
     */
    protected $cartManagement;

    /**
     * @var \Magento\Quote\Model\QuoteIdMaskFactory
     */
    protected $quoteIdMaskFactory;

    /**
     * GuestPaymentManagement constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Digia\AvardaCheckout\Api\QuotePaymentManagementInterface $quotePaymentManagement
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Quote\Api\GuestCartManagementInterface $guestCartManagement
     * @param \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Digia\AvardaCheckout\Api\QuotePaymentManagementInterface $quotePaymentManagement,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Quote\Api\GuestCartManagementInterface $cartManagement,
        \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory
    ) {
        $this->logger = $logger;
        $this->quotePaymentManagement = $quotePaymentManagement;
        $this->checkoutSession = $checkoutSession;
        $this->cartManagement = $cartManagement;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function getPurchaseId($cartId)
    {
        try {
            return $this->quotePaymentManagement->getPurchaseId(
                $this->getQuoteId($cartId)
            );
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
            $this->quotePaymentManagement->freezeCart(
                $this->getQuoteId($cartId)
            );
            $this->checkoutSession->setAvardaCartId($cartId);
        } catch (\Digia\AvardaCheckout\Exception\BadRequestException $e) {
            $this->logger->error($e);

            throw new PaymentException(__($e->getMessage()));
        } catch (\Exception $e) {
            $this->logger->error($e);

            throw new PaymentException(
                __('Failed to save Avarda order. Please try again later.')
            );
        }
    }

    /**
     * {@inheritdoc}
     */
    public function updateAndPlaceOrder($cartId)
    {
        try {
            $this->quotePaymentManagement->updatePaymentStatus(
                $this->getQuoteId($cartId)
            );

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

    /**
     * Get the quote ID from masked cart ID
     *
     * @param int $cartId
     * @return int
     */
    protected function getQuoteId($cartId)
    {
        // getQuoteId() == $cartId == quote::entity_id
        $quoteIdMask = $this->quoteIdMaskFactory->create()
            ->load($cartId, 'masked_id');

        return $quoteIdMask->getQuoteId();
    }
}
