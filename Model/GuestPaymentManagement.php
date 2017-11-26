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
     * @var \Digia\AvardaCheckout\Api\QuotePaymentManagementInterface
     */
    protected $quoteIdMaskFactory;

    /**
     * GuestPaymentManagement constructor.
     *
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Digia\AvardaCheckout\Api\QuotePaymentManagementInterface $quotePaymentManagement
     * @param \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory
     */
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Digia\AvardaCheckout\Api\QuotePaymentManagementInterface $quotePaymentManagement,
        \Magento\Quote\Model\QuoteIdMaskFactory $quoteIdMaskFactory
    ) {
        $this->logger = $logger;
        $this->quotePaymentManagement = $quotePaymentManagement;
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function getPurchaseId($cartId)
    {
        try {
            $quoteIdMask = $this->quoteIdMaskFactory->create()
                ->load($cartId, 'masked_id');

            // getQuoteId() == $cartId == quote::entity_id
            return $this->quotePaymentManagement->getPurchaseId(
                $quoteIdMask->getQuoteId()
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
    public function updateAndSaveOrder($cartId)
    {
        throw new PaymentException(
            __('Not implemented yet.')
        );
    }
}
