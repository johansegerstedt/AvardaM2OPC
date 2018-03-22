<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Test\Unit\Gateway\Request;

use Magento\Framework\TestFramework\Unit\Helper\ObjectManager;

/**
 * Class OrderReferenceDataBuilderTest
 */
class OrderReferenceDataBuilderTest extends \PHPUnit\Framework\TestCase
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
     * @var \PHPUnit_Framework_MockObject_MockObject|\Magento\Payment\Gateway\Data\PaymentDataObjectInterface
     */
    protected $paymentDataMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Digia\AvardaCheckout\Gateway\Request\OrderReferenceDataBuilder
     */
    protected $orderReferenceDataBuilder;

    public function setUp()
    {
        $this->objectManager = new ObjectManager($this);

        $this->orderMock = $this->createMock(\Magento\Payment\Gateway\Data\OrderAdapterInterface::class);

        $this->paymentDataMock = $this->createMock(\Magento\Payment\Gateway\Data\PaymentDataObjectInterface::class);
        $this->paymentDataMock->method('getOrder')->willReturn($this->orderMock);

        $this->orderReferenceDataBuilder = $this->objectManager->getObject(
            \Digia\AvardaCheckout\Gateway\Request\OrderReferenceDataBuilder::class
        );
    }

    public function testBuild()
    {
        $this->orderMock->method('getOrderIncrementId')->will($this->returnValue('1234'));

        $result = $this->orderReferenceDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([
            'OrderReference' => '1234',
        ], $result);
    }

    public function testBuildEmpty()
    {
        $this->orderMock->method('getOrderIncrementId')->willReturn(null);

        $result = $this->orderReferenceDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([
            'OrderReference' => '',
        ], $result);
    }
}
