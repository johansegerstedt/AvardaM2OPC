<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Test\Unit\Gateway\Request;

use Magento\Framework\TestFramework\Unit\Helper\ObjectManager;

/**
 * Class CustomerDataBuilderTest
 */
class CustomerDataBuilderTest extends \PHPUnit\Framework\TestCase
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
     * @var \PHPUnit_Framework_MockObject_MockObject|\Magento\Payment\Gateway\Data\PaymentDataObjectInterface
     */
    protected $paymentDataMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Digia\AvardaCheckout\Gateway\Request\CustomerDataBuilder
     */
    protected $customerDataBuilder;

    public function setUp()
    {
        $this->objectManager = new ObjectManager($this);

        $this->orderMock          = $this->createMock(\Magento\Payment\Gateway\Data\OrderAdapterInterface::class);
        $this->billingAddressMock = $this->createMock(\Magento\Payment\Gateway\Data\AddressAdapterInterface::class);

        $this->paymentDataMock = $this->createMock(\Magento\Payment\Gateway\Data\PaymentDataObjectInterface::class);
        $this->paymentDataMock->method('getOrder')->willReturn($this->orderMock);

        $this->customerDataBuilder = $this->objectManager->getObject(
            \Digia\AvardaCheckout\Gateway\Request\CustomerDataBuilder::class
        );
    }

    public function testBuild()
    {
        $this->billingAddressMock->method('getTelephone')->will($this->returnValue('0501234567'));
        $this->billingAddressMock->method('getEmail')->will($this->returnValue('test@test.com'));

        $this->orderMock->method('getBillingAddress')->willReturn($this->billingAddressMock);

        $result = $this->customerDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([
            'Phone' => '0501234567',
            'Mail'  => 'test@test.com',
        ], $result);
    }

    public function testBuildPartially()
    {
        $this->billingAddressMock->method('getTelephone')->will($this->returnValue(''));
        $this->billingAddressMock->method('getEmail')->will($this->returnValue('test@test.com'));

        $this->orderMock->method('getBillingAddress')->willReturn($this->billingAddressMock);

        $result = $this->customerDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([
            'Phone' => '',
            'Mail'  => 'test@test.com',
        ], $result);
    }

    public function testBuildEmpty()
    {
        $this->orderMock->method('getBillingAddress')->willReturn(null);

        $result = $this->customerDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([], $result);
    }
}
