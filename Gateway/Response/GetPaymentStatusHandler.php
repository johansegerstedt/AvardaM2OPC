<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Response;

use Digia\AvardaCheckout\Helper\PaymentMethod;
use Digia\AvardaCheckout\Helper\PurchaseState;
use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Response\HandlerInterface;
use Magento\Quote\Api\CartRepositoryInterface;
use Magento\Quote\Api\Data\AddressInterfaceFactory;

/**
 * Class GetPaymentStatusHandler
 */
class GetPaymentStatusHandler implements HandlerInterface
{
    /**
     * @var CartRepositoryInterface
     */
    protected $quoteRepository;

    /**
     * @var AddressInterfaceFactory
     */
    protected $addressFactory;

    /**
     * @var PaymentMethod
     */
    protected $methodHelper;

    /**
     * @var PurchaseState
     */
    protected $stateHelper;

    /**
     * GetPaymentStatusHandler constructor.
     *
     * @param CartRepositoryInterface $quoteRepository
     * @param AddressInterfaceFactory $addressFactory
     * @param PaymentMethod $methodHelper
     * @param PurchaseState $stateHelper
     */
    public function __construct(
        CartRepositoryInterface $quoteRepository,
        AddressInterfaceFactory $addressFactory,
        PaymentMethod $methodHelper,
        PurchaseState $stateHelper
    ) {
        $this->quoteRepository = $quoteRepository;
        $this->addressFactory = $addressFactory;
        $this->methodHelper = $methodHelper;
        $this->stateHelper = $stateHelper;
    }

    /**
     * @inheritdoc
     */
    public function handle(array $handlingSubject, array $response)
    {
        $response = reset($response);
        $paymentDO = SubjectReader::readPayment($handlingSubject);
        $order = $paymentDO->getOrder();

        $entityId = $order->getId();
        $quote = $this->quoteRepository->get($entityId);
        $telephone = $response->Phone;
        $email = $response->Mail;

        // Set quote data
        $quote->setCustomerEmail($email);

        // Save billing (invoicing) address
        /** @var \Magento\Quote\Api\Data\AddressInterface $billingAddress */
        $billingAddress = $this->addressFactory->create();
        $billingAddress->setTelephone($telephone);
        $billingAddress->setEmail($email);
        $billingAddress->setFirstname($response->InvoicingFirstName);
        $billingAddress->setLastname($response->InvoicingLastName);
        $billingAddress->setStreet([
            $response->InvoicingAddressLine1,
            $response->InvoicingAddressLine2 !== null ? $response->InvoicingAddressLine2 : "",
        ]);
        $billingAddress->setPostcode($response->InvoicingZip);
        $billingAddress->setCity($response->InvoicingCity);
        $billingAddress->setCountryId('FI');
        $billingAddress->setRegionId(336);
        $quote->setBillingAddress($billingAddress);

        // Save shipping (delivery) address
        if ($response->DeliveryFirstName !== null) {
            /** @var \Magento\Quote\Api\Data\AddressInterface $shippingAddress */
            $shippingAddress = $this->addressFactory->create();
            $shippingAddress->setTelephone($telephone);
            $shippingAddress->setEmail($email);
            $shippingAddress->setFirstname($response->DeliveryFirstName);
            $shippingAddress->setLastname($response->DeliveryLastName);
            $shippingAddress->setStreet([
                $response->DeliveryAddressLine1,
                $response->DeliveryAddressLine2 !== null ? $response->DeliveryAddressLine2 : "",
            ]);
            $shippingAddress->setPostcode($response->DeliveryZip);
            $shippingAddress->setCity($response->DeliveryCity);
            $shippingAddress->setCountryId('FI');
            $shippingAddress->setRegionId(336);
            $quote->setShippingAddress($shippingAddress);
        } else {
            $quote->setShippingAddress($billingAddress);
        }

        // Set payment method
        $paymentMethod = $this->methodHelper
            ->getPaymentMethod($response->PaymentMethod);
        $quote->getPayment()->setMethod($paymentMethod);
    }
}