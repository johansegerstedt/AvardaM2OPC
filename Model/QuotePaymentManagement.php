<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class QuotePaymentManagement implements QuotePaymentManagementInterface
{
    /**
     * @var \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory
     */
    public $paymentDetailsFactory;

    /**
     * @var \Magento\Quote\Api\CartRepositoryInterface
     */
    public $quoteRepository;

    /**
     * GuestPaymentManagement constructor.
     *
     * @param \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory $paymentDetailsFactory
     */
    public function __construct(
        \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory $paymentDetailsFactory,
        \Magento\Quote\Api\CartRepositoryInterface $quoteRepository
    ) {
        $this->paymentDetailsFactory = $paymentDetailsFactory;
        $this->quoteRepository = $quoteRepository;
    }

    /**
     * {@inheritdoc}
     */
    public function getPurchaseId($cartId)
    {
        $quote = $this->quoteRepository->get($cartId);
        $paymentDetails = $this->paymentDetailsFactory->create();

        // TODO: Fetch purchaseId based on current quote
        $paymentDetails->setPurchaseId('Quote Payment Return');

        return $paymentDetails;
    }
}
