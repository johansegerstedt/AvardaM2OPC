<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Magento\Payment\Gateway\Data\OrderAdapterInterface;
use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;

/**
 * Class AddressDataBuilder
 */
class AddressDataBuilder implements BuilderInterface
{
    /**
     * Whether the customer can edit the attributes related to invoicing address
     * manually.
     */
    const IS_INVOICING_EDITABLE = 'IsInvoicingEditable';

    /**
     * Enabling/disabling checkbox visibility for delivery address.
     */
    const IS_DELIVERY_EDITABLE = 'IsDeliveryEditable';

    /**
     * Delivery address fields prefix
     */
    const DELIVERY_PREFIX = 'Delivery';

    /**
     * Invoicing address fields prefix
     */
    const INVOICING_PREFIX = 'Invoicing';

    /**
     * The first name value must be less than or equal to 40 characters.
     */
    const FIRST_NAME = 'FirstName';

    /**
     * The last name value must be less than or equal to 40 characters.
     */
    const LAST_NAME = 'LastName';

    /**
     * The street address line 1. Maximum 40 characters.
     */
    const STREET_1 = 'AddressLine1';

    /**
     * The street address line 2. Maximum 40 characters.
     */
    const STREET_2 = 'AddressLine2';

    /**
     * The Zip/Postal code. Maximum 6 characters.
     */
    const ZIP = 'Zip';

    /**
     * The locality/city. 30 character maximum.
     */
    const CITY = 'City';

    /**
     * @inheritdoc
     */
    public function build(array $buildSubject)
    {
        $paymentDO = SubjectReader::readPayment($buildSubject);
        $order     = $paymentDO->getOrder();

        return array_merge(
            $this->setBillingAddress($order),
            $this->setShippingAddress($order),
            $this->setAdditionalData($order)
        );
    }

    /**
     * @param OrderAdapterInterface $order
     * @return array
     */
    protected function setBillingAddress(OrderAdapterInterface $order)
    {
        $address = $order->getBillingAddress();
        if ($address !== null && $address->getPostcode() !== null) {
            return [
                self::INVOICING_PREFIX . self::FIRST_NAME => $address->getFirstname(),
                self::INVOICING_PREFIX . self::LAST_NAME  => $address->getLastname(),
                self::INVOICING_PREFIX . self::STREET_1   => $address->getStreetLine1(),
                self::INVOICING_PREFIX . self::STREET_2   => $address->getStreetLine2(),
                self::INVOICING_PREFIX . self::ZIP        => $address->getPostcode(),
                self::INVOICING_PREFIX . self::CITY       => $address->getCity(),
            ];
        }

        /**
         * Add postcode to invoicing zip if billing address is not set yet. This
         * way it can be pre-filled in Avarda iframe.
         */
        $address = $order->getShippingAddress();
        if ($address !== null) {
            return [
                self::INVOICING_PREFIX . self::ZIP => $address->getPostcode(),
            ];
        }

        return [];
    }

    /**
     * @param OrderAdapterInterface $order
     * @return array
     */
    protected function setShippingAddress(OrderAdapterInterface $order)
    {
        $address = $order->getShippingAddress();
        if ($address === null) {
            return [];
        }

        return [
            self::DELIVERY_PREFIX . self::FIRST_NAME => $address->getFirstname(),
            self::DELIVERY_PREFIX . self::LAST_NAME  => $address->getLastname(),
            self::DELIVERY_PREFIX . self::ZIP        => $address->getPostcode(),
            self::DELIVERY_PREFIX . self::CITY       => $address->getCity(),
        ];
    }

    /**
     * Enable editing inside the Avarda iframe
     *
     * @param OrderAdapterInterface $order
     * @return array
     */
    protected function setAdditionalData(OrderAdapterInterface $order)
    {
        return [
            self::IS_INVOICING_EDITABLE => 'true',
            self::IS_DELIVERY_EDITABLE  => 'true',
        ];
    }
}
