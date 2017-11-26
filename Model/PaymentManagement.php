<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\PaymentManagementInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class PaymentManagement implements PaymentManagementInterface
{
    /**
     * @var \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory
     */
    protected $paymentDetailsFactory;

    /**
     * GuestPaymentManagement constructor.
     *
     * @param \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory $paymentDetailsFactory
     */
    public function __construct(
        \Digia\AvardaCheckout\Api\Data\PaymentDetailsInterfaceFactory $paymentDetailsFactory
    ) {
        $this->paymentDetailsFactory = $paymentDetailsFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function getPurchaseId($cartId)
    {
        return $this->quotePaymentManagement->getPurchaseId($cartId);
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
