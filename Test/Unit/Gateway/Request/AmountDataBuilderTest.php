<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Test\Unit\Gateway\Request;

use Magento\Framework\TestFramework\Unit\Helper\ObjectManager;

/**
 * Class AmountDataBuilderTest
 */
class AmountDataBuilderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Framework\TestFramework\Unit\Helper\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Digia\AvardaCheckout\Gateway\Request\AmountDataBuilder
     */
    protected $amountDataBuilder;

    public function setUp()
    {
        $this->objectManager = new ObjectManager($this);

        $this->amountDataBuilder = $this->objectManager->getObject(
            \Digia\AvardaCheckout\Gateway\Request\AmountDataBuilder::class
        );
    }

    public function testBuild()
    {
        $result = $this->amountDataBuilder->build([
            'amount' => 10.00,
        ]);

        $this->assertEquals([
            'Amount' => 10.00,
        ], $result);
    }

    public function testBuildFormatting()
    {
        $result = $this->amountDataBuilder->build([
            'amount' => '10',
        ]);

        $this->assertEquals([
            'Amount' => 10.00,
        ], $result);
    }

    public function testBuildEmpty()
    {
        $result = $this->amountDataBuilder->build([
            'amount' => 0,
        ]);

        $this->assertEquals([
            'Amount' => 0.00,
        ], $result);
    }
}
