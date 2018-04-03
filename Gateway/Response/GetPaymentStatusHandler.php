<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Response;

use Digia\AvardaCheckout\Helper\PaymentMethod;
use Digia\AvardaCheckout\Helper\PurchaseState;
use Magento\Directory\Model\CountryFactory;
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
     * @var CountryFactory
     */
    protected $countryFactory;

    /**
     * @var \Magento\Customer\Model\Session
     */
    protected $customerSession;

    /**
     * @var \Magento\Customer\Api\CustomerRepositoryInterface
     */
    protected $customerRepository;

    /**
     * GetPaymentStatusHandler constructor.
     *
     * @param CartRepositoryInterface $quoteRepository
     * @param AddressInterfaceFactory $addressFactory
     * @param PaymentMethod $methodHelper
     * @param PurchaseState $stateHelper
     * @param CountryFactory $countryFactory
     * @param \Magento\Customer\Model\Session $customerSession
     * @param \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository
     */
    public function __construct(
        CartRepositoryInterface $quoteRepository,
        AddressInterfaceFactory $addressFactory,
        PaymentMethod $methodHelper,
        PurchaseState $stateHelper,
        CountryFactory $countryFactory,
        \Magento\Customer\Model\Session $customerSession,
        \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository
    ) {
        $this->quoteRepository = $quoteRepository;
        $this->addressFactory = $addressFactory;
        $this->methodHelper = $methodHelper;
        $this->stateHelper = $stateHelper;
        $this->countryFactory = $countryFactory;
        $this->customerSession = $customerSession;
        $this->customerRepository = $customerRepository;
    }

    /**
     * {@inheritdoc}
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
            $response->InvoicingAddressLine2 !== null ? $response->InvoicingAddressLine2 : '',
        ]);
        $billingAddress->setPostcode($response->InvoicingZip);
        $billingAddress->setCity($response->InvoicingCity);

        // Convert country from alpha-3 to alpha-2
        $billingCountry = $this->countryFactory->create()->loadByCode($response->CountryCode);
        $billingAddress->setCountryId($billingCountry->getId());

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
                $response->DeliveryAddressLine2 !== null ? $response->DeliveryAddressLine2 : '',
            ]);
            $shippingAddress->setPostcode($response->DeliveryZip);
            $shippingAddress->setCity($response->DeliveryCity);

            // Convert country from alpha-3 to alpha-2
            $shippingCountry = $this->countryFactory->create()->loadByCode($response->DeliveryCountry);
            $shippingAddress->setCountryId($shippingCountry->getId());

            $quote->setShippingAddress($shippingAddress);
        } else {
            $quote->setShippingAddress($billingAddress);
        }

        // Set payment method
        $paymentMethod = $this->methodHelper
            ->getPaymentMethod($response->PaymentMethod);
        $quote->getPayment()->setMethod($paymentMethod);

        // Set payment state
        $quote->getPayment()->setAdditionalInformation(
            \Digia\AvardaCheckout\Helper\PaymentData::STATE_ID,
            $response->State
        );

        // Save customer token
        $this->saveCustomerToken($response);
    }

    /**
     * Save customer token from response so it can be reused in iframe
     *
     * @param \StdClass $response
     *
     * @throws \Magento\Framework\Exception\InputException
     * @throws \Magento\Framework\Exception\LocalizedException
     * @throws \Magento\Framework\Exception\State\InputMismatchException
     *
     * @return void
     */
    public function saveCustomerToken(\StdClass $response)
    {
        if (!$this->customerSession->isLoggedIn()) {
            return;
        }

        if (isset($response->CustomerToken) && !empty($response->CustomerToken)) {
            $customer = $this->customerSession
                ->getCustomerData()
                ->setCustomAttribute(
                    'avarda_customer_token',
                    $response->CustomerToken
                );

            $this->customerRepository->save($customer);
        }
    }
}
