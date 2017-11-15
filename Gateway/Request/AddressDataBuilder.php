<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Request;

use Magento\Payment\Gateway\Helper\SubjectReader;
use Magento\Payment\Gateway\Request\BuilderInterface;

/**
 * Class AddressDataBuilder
 */
class AddressDataBuilder implements BuilderInterface
{
    /**
     * Delivery address fields prefix
     */
    const DELIVERY_ADDRESS_PREFIX = 'Delivery';

    /**
     * Invoicing address fields prefix
     */
    const INVOICING_ADDRESS_PREFIX = 'Invoicing';

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
    const STREET_ADDRESS_1 = 'StreetAddress';

    /**
     * The street address line 2. Maximum 40 characters.
     */
    const STREET_ADDRESS_2 = 'StreetAddress';

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

        $order = $paymentDO->getOrder();
        $result = [];

        $billingAddress = $order->getBillingAddress();
        if ($billingAddress) {
            $result[self::INVOICING_ADDRESS_PREFIX . self::FIRST_NAME] = $billingAddress->getFirstname();
            $result[self::INVOICING_ADDRESS_PREFIX . self::LAST_NAME] = $billingAddress->getLastname();
            $result[self::INVOICING_ADDRESS_PREFIX . self::STREET_ADDRESS_1] = $billingAddress->getStreetLine1();
            $result[self::INVOICING_ADDRESS_PREFIX . self::STREET_ADDRESS_2] = $billingAddress->getStreetLine2();
            $result[self::INVOICING_ADDRESS_PREFIX . self::ZIP] = $billingAddress->getPostcode();
            $result[self::INVOICING_ADDRESS_PREFIX . self::CITY] = $billingAddress->getCity();
        }

        $shippingAddress = $order->getShippingAddress();
        if ($shippingAddress) {
            $result[self::DELIVERY_ADDRESS_PREFIX . self::FIRST_NAME] = $billingAddress->getFirstname();
            $result[self::DELIVERY_ADDRESS_PREFIX . self::LAST_NAME] = $billingAddress->getLastname();
            $result[self::DELIVERY_ADDRESS_PREFIX . self::ZIP] = $billingAddress->getPostcode();
            $result[self::DELIVERY_ADDRESS_PREFIX . self::CITY] = $billingAddress->getCity();
        }

        return $result;
    }
}
