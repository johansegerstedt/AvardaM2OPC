<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Test\Unit\Gateway\Request;

use Magento\Framework\TestFramework\Unit\Helper\ObjectManager;

/**
 * Class AddressDataBuilderTest
 */
class AddressDataBuilderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Framework\TestFramework\Unit\Helper\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Magento\Payment\Gateway\Data\OrderAdapterInterface
     */
    protected $orderMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Magento\Payment\Gateway\Data\AddressAdapterInterface
     */
    protected $billingAddressMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Magento\Payment\Gateway\Data\AddressAdapterInterface
     */
    protected $shippingAddressMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Magento\Payment\Gateway\Data\PaymentDataObjectInterface
     */
    protected $paymentDataMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Digia\AvardaCheckout\Gateway\Request\AddressDataBuilder
     */
    protected $addressDataBuilder;

    public function setUp()
    {
        $this->objectManager = new ObjectManager($this);

        $this->orderMock           = $this->createMock(\Magento\Payment\Gateway\Data\OrderAdapterInterface::class);
        $this->billingAddressMock  = $this->createMock(\Magento\Payment\Gateway\Data\AddressAdapterInterface::class);
        $this->shippingAddressMock = $this->createMock(\Magento\Payment\Gateway\Data\AddressAdapterInterface::class);

        $this->paymentDataMock = $this->createMock(\Magento\Payment\Gateway\Data\PaymentDataObjectInterface::class);
        $this->paymentDataMock->method('getOrder')->willReturn($this->orderMock);

        $this->addressDataBuilder = $this->objectManager->getObject(
            \Digia\AvardaCheckout\Gateway\Request\AddressDataBuilder::class
        );
    }

    public function testBuild()
    {
        $this->billingAddressMock->method('getStreetLine1')->will($this->returnValue('Street line 1'));
        $this->billingAddressMock->method('getStreetLine2')->will($this->returnValue('Street line 2'));
        $this->billingAddressMock->method('getPostcode')->will($this->returnValue('12345'));
        $this->billingAddressMock->method('getCity')->will($this->returnValue('Billing City'));
        $this->billingAddressMock->method('getFirstname')->will($this->returnValue('Billing Firstname'));
        $this->billingAddressMock->method('getLastname')->will($this->returnValue('Billing Lastname'));

        $this->shippingAddressMock->method('getPostcode')->will($this->returnValue('54321'));
        $this->shippingAddressMock->method('getCity')->will($this->returnValue('Shipping City'));
        $this->shippingAddressMock->method('getFirstname')->will($this->returnValue('Shipping Firstname'));
        $this->shippingAddressMock->method('getLastname')->will($this->returnValue('Shipping Lastname'));

        $this->orderMock->method('getBillingAddress')->willReturn($this->billingAddressMock);
        $this->orderMock->method('getShippingAddress')->willReturn($this->shippingAddressMock);

        $result = $this->addressDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([
            'InvoicingFirstName'    => 'Billing Firstname',
            'InvoicingLastName'     => 'Billing Lastname',
            'InvoicingAddressLine1' => 'Street line 1',
            'InvoicingAddressLine2' => 'Street line 2',
            'InvoicingZip'          => '12345',
            'InvoicingCity'         => 'Billing City',
            'DeliveryFirstName'     => 'Shipping Firstname',
            'DeliveryLastName'      => 'Shipping Lastname',
            'DeliveryZip'           => '54321',
            'DeliveryCity'          => 'Shipping City',
            'IsInvoicingEditable'   => 'true',
            'IsDeliveryEditable'    => 'true',
        ], $result);
    }

    public function testBuildPartially()
    {
        $this->billingAddressMock->method('getStreetLine1')->will($this->returnValue('Street line 1'));
        $this->billingAddressMock->method('getStreetLine2')->will($this->returnValue('Street line 2'));
        $this->billingAddressMock->method('getPostcode')->will($this->returnValue('12345'));
        $this->billingAddressMock->method('getCity')->will($this->returnValue(''));
        $this->billingAddressMock->method('getFirstname')->will($this->returnValue(''));
        $this->billingAddressMock->method('getLastname')->will($this->returnValue(''));

        $this->shippingAddressMock->method('getPostcode')->will($this->returnValue('54321'));
        $this->shippingAddressMock->method('getCity')->will($this->returnValue(''));
        $this->shippingAddressMock->method('getFirstname')->will($this->returnValue(''));
        $this->shippingAddressMock->method('getLastname')->will($this->returnValue(''));

        $this->orderMock->method('getBillingAddress')->willReturn($this->billingAddressMock);
        $this->orderMock->method('getShippingAddress')->willReturn($this->shippingAddressMock);

        $result = $this->addressDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([
            'InvoicingFirstName'    => '',
            'InvoicingLastName'     => '',
            'InvoicingAddressLine1' => 'Street line 1',
            'InvoicingAddressLine2' => 'Street line 2',
            'InvoicingZip'          => '12345',
            'InvoicingCity'         => '',
            'DeliveryFirstName'     => '',
            'DeliveryLastName'      => '',
            'DeliveryZip'           => '54321',
            'DeliveryCity'          => '',
            'IsInvoicingEditable'   => 'true',
            'IsDeliveryEditable'    => 'true',
        ], $result);
    }

    public function testBuildEmpty()
    {
        $this->orderMock->method('getBillingAddress')->willReturn(null);
        $this->orderMock->method('getShippingAddress')->willReturn(null);

        $result = $this->addressDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([
            'IsInvoicingEditable'   => 'true',
            'IsDeliveryEditable'    => 'true',
        ], $result);
    }
}
