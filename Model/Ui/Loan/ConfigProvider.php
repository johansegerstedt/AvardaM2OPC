<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model\Ui\Loan;

use Digia\AvardaCheckout\Model\Ui\ConfigProvider as BaseConfigProvider;

/**
 * Class ConfigProvider
 */
class ConfigProvider extends BaseConfigProvider
{
    const CODE = 'avarda_loan';

    /**
     * Disable the module in frontend, the payment method should only be selectable through Avarda Checkout.
     *
     * @return array
     */
    public function getConfig()
    {
        $config = [
            'payment' => [
                self::CODE => [
                    'isActive' => false,
                ]
            ]
        ];

        return $config;
    }
}
