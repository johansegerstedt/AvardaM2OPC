<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Test\Unit\Gateway\Request;

use Magento\Framework\TestFramework\Unit\Helper\ObjectManager;

/**
 * Class PriceDataBuilderTest
 */
class PriceDataBuilderTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\Framework\TestFramework\Unit\Helper\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject|\Digia\AvardaCheckout\Gateway\Request\PriceDataBuilder
     */
    protected $priceDataBuilder;

    public function setUp()
    {
        $this->objectManager = new ObjectManager($this);

        $this->priceDataBuilder = $this->objectManager->getObject(
            \Digia\AvardaCheckout\Gateway\Request\PriceDataBuilder::class
        );
    }

    public function testBuild()
    {
        $result = $this->priceDataBuilder->build([
            'amount' => 10.00,
        ]);

        $this->assertEquals([
            'Price' => 10.00,
        ], $result);
    }

    public function testBuildFormatting()
    {
        $result = $this->priceDataBuilder->build([
            'amount' => '10',
        ]);

        $this->assertEquals([
            'Price' => 10.00,
        ], $result);
    }

    public function testBuildEmpty()
    {
        $result = $this->priceDataBuilder->build([
            'amount' => 0,
        ]);

        $this->assertEquals([
            'Price' => 0.00,
        ], $result);
    }
}
