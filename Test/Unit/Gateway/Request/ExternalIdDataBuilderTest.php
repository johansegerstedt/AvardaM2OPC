<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Test\Unit\Gateway\Request;

use Magento\Framework\TestFramework\Unit\Helper\ObjectManager;

/**
 * Class ExternalIdDataBuilderTest
 */
class ExternalIdDataBuilderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Framework\TestFramework\Unit\Helper\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Magento\Payment\Model\InfoInterface
     */
    protected $paymentMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Magento\Payment\Gateway\Data\PaymentDataObjectInterface
     */
    protected $paymentDataMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Digia\AvardaCheckout\Helper\PaymentData
     */
    protected $paymentDataHelperMock;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Digia\AvardaCheckout\Gateway\Request\ExternalIdDataBuilder
     */
    protected $externalIdDataBuilder;

    public function setUp()
    {
        $this->objectManager = new ObjectManager($this);

        $this->paymentMock = $this->createMock(\Magento\Payment\Model\InfoInterface::class);

        $this->paymentDataMock = $this->createMock(\Magento\Payment\Gateway\Data\PaymentDataObjectInterface::class);
        $this->paymentDataMock->method('getPayment')->willReturn($this->paymentMock);

        $this->paymentDataHelperMock = $this->createMock(\Digia\AvardaCheckout\Helper\PaymentData::class);

        $this->externalIdDataBuilder = $this->objectManager->getObject(
            \Digia\AvardaCheckout\Gateway\Request\ExternalIdDataBuilder::class,
            [
                'paymentDataHelper' => $this->paymentDataHelperMock,
            ]
        );
    }

    public function testBuild()
    {
        $this->paymentDataHelperMock
            ->expects($this->once())
            ->method('getPurchaseId')
            ->will($this->returnValue('1234'));

        $result = $this->externalIdDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([
            'ExternalId' => '1234',
        ], $result);
    }

    public function testBuildEmpty()
    {
        $this->paymentDataHelperMock
            ->expects($this->once())
            ->method('getPurchaseId')
            ->will($this->returnValue(false));

        $result = $this->externalIdDataBuilder->build([
            'payment' => $this->paymentDataMock
        ]);

        $this->assertEquals([], $result);
    }
}
