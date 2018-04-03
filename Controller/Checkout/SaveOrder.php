<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Controller\Checkout;

use Digia\AvardaCheckout\Api\QuotePaymentManagementInterface;
use Digia\AvardaCheckout\Controller\AbstractCheckout;
use Magento\Framework\Exception\PaymentException;

class SaveOrder extends AbstractCheckout
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
     * @var QuotePaymentManagementInterface $quotePaymentManagement
     */
    protected $quotePaymentManagement;

    /**
     * Index constructor.
     *
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Digia\AvardaCheckout\Gateway\Config\Config $config
     * @param \Magento\Checkout\Model\Session $checkoutSession
     * @param \Magento\Customer\Model\Session $customerSession
     * @param QuotePaymentManagementInterface $quotePaymentManagement
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Psr\Log\LoggerInterface $logger,
        \Digia\AvardaCheckout\Gateway\Config\Config $config,
        \Magento\Checkout\Model\Session $checkoutSession,
        \Magento\Customer\Model\Session $customerSession,
        QuotePaymentManagementInterface $quotePaymentManagement
    ) {
        parent::__construct($context, $logger, $config);
        $this->checkoutSession = $checkoutSession;
        $this->customerSession = $customerSession;
        $this->quotePaymentManagement = $quotePaymentManagement;
    }

    /**
     * Order success action
     *
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        try {
            if (($purchaseId = $this->getPurchaseId()) === null) {
                throw new \Exception(
                    __('Failed to save order with purchase ID "%purchase_id"', [
                        'purchase_id' => $purchaseId
                    ])
                );
            }

            $quoteId = $this->quotePaymentManagement
                ->getQuoteIdByPurchaseId($purchaseId);

            $this->quotePaymentManagement->updatePaymentStatus($quoteId);
            $this->quotePaymentManagement->placeOrder(
                $quoteId,
                !$this->customerSession->isLoggedIn()
            );

            return $this->resultRedirectFactory->create()->setPath(
                'checkout/onepage/success'
            );
        } catch (PaymentException $e) {
            $message = $e->getMessage();
        } catch (\Exception $e) {
            $this->logger->error($e);
            $message = __('Failed to save Avarda order. Please try again later.');
        }

        $this->messageManager->addErrorMessage($message);
        return $this->resultRedirectFactory->create()->setPath(
            'checkout/cart'
        );
    }
}
