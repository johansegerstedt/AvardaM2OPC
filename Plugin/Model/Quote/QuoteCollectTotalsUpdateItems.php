<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Plugin\Model\Quote;

use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Magento\Framework\Exception\PaymentException;
use Magento\Framework\Webapi\Exception as WebapiException;
use Magento\Quote\Api\Data\CartInterface;

class QuoteCollectTotalsUpdateItems
{
    /**
     * Required for triggering update items request.
     *
     * @var QuotePaymentManagementInterface
     */
    protected $quotePaymentManagement;

    /**
     * Helper for reading payment info instances, e.g. getting purchase ID
     * from quote payment.
     *
     * @var \Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelper;

    /**
     * Helper to determine Avarda's purchase state.
     *
     * @var \Digia\AvardaCheckout\Helper\PurchaseState
     */
    protected $purchaseStateHelper;

    /**
     * Variable to ensure this plugin's logic is applied only once.
     *
     * @var bool
     */
    protected $collectTotalsFlag = false;

    /**
     * QuoteCollectTotals constructor.
     *
     * @param QuotePaymentManagementInterface $quotePaymentManagement
     * @param \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper
     * @param \Digia\AvardaCheckout\Helper\PurchaseState $purchaseStateHelper
     */
    public function __construct(
        QuotePaymentManagementInterface $quotePaymentManagement,
        \Digia\AvardaCheckout\Helper\PaymentData $paymentDataHelper,
        \Digia\AvardaCheckout\Helper\PurchaseState $purchaseStateHelper
    ) {
        $this->quotePaymentManagement = $quotePaymentManagement;
        $this->paymentDataHelper = $paymentDataHelper;
        $this->purchaseStateHelper = $purchaseStateHelper;
    }

    /**
     * Collect totals is triggered when quote is updated in any way, making it a
     * safe function to utilize and guarantee item updates to Avarda.
     *
     * @param CartInterface|\Magento\Quote\Model\Quote $subject
     * @param CartInterface|\Magento\Quote\Model\Quote $result
     * @return CartInterface
     *
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterCollectTotals(CartInterface $subject, CartInterface $result)
    {
        $payment = $subject->getPayment();
        if (!$this->collectTotalsFlag &&
            $this->paymentDataHelper->isAvardaPayment($payment)
        ) {
            $this->collectTotalsFlag = true;
            $stateId = $this->getStateId($subject);
            if (($renew = $this->purchaseStateHelper->isDead($stateId)) == false) {
                try {
                    $this->quotePaymentManagement->updateItems($subject);
                } catch (WebapiException $e) {
                    $renew = true;
                }
            }

            if ($renew) {
                $this->quotePaymentManagement->initializePurchase($subject);
            }
        }

        return $result;
    }

    /**
     * Get state ID based on payment object
     *
     * @param CartInterface|\Magento\Quote\Model\Quote $subject
     * @throws PaymentException
     * @return int
     */
    protected function getStateId(CartInterface $subject)
    {
        $payment = $subject->getPayment();
        $stateId = $this->paymentDataHelper->getStateId($payment);
        if (!$this->purchaseStateHelper->isInCheckout($stateId)) {
            $this->quotePaymentManagement
                ->updatePaymentStatus($subject->getId());

            $stateId = $this->paymentDataHelper->getStateId($payment);
            if ($this->purchaseStateHelper->isWaiting($stateId)) {
                throw new PaymentException(
                    __('Avarda is processing the purchase, unable to update items.')
                );
            }
        }

        return $stateId;
    }
}
