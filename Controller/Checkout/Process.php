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

class Process extends AbstractCheckout
{
    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * @var QuotePaymentManagementInterface
     */
    protected $quotePaymentManagement;

    /**
     * Process constructor.
     *
     * @param \Magento\Framework\App\Action\Context $context
     * @param \Psr\Log\LoggerInterface $logger
     * @param \Digia\AvardaCheckout\Gateway\Config\Config $config
     * @param \Magento\Framework\View\Result\PageFactory $resultPageFactory
     * @param QuotePaymentManagementInterface $quotePaymentManagement
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Psr\Log\LoggerInterface $logger,
        \Digia\AvardaCheckout\Gateway\Config\Config $config,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        QuotePaymentManagementInterface $quotePaymentManagement
    ) {
        parent::__construct($context, $logger, $config);
        $this->resultPageFactory = $resultPageFactory;
        $this->quotePaymentManagement = $quotePaymentManagement;
    }

    /**
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        // Show no route if Avarda is inactive and notify webmaster in logs.
        if (!$this->isCallback() && !$this->config->isActive()) {
            return $this->noroute('/checkout/avarda/process');
        }

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
            $this->quotePaymentManagement->setQuoteIsActive($quoteId, true);
            return $this->resultPageFactory->create();

        } catch (PaymentException $e) {
            $message = $e->getMessage();
        } catch (\Exception $e) {
            $this->logger->error($e);
            $message = __('Failed to save Avarda order. Please try again later.');
        }

        $this->messageManager->addErrorMessage($message);
        return $this->resultRedirectFactory
            ->create()->setPath('avarda/checkout');
    }
}
