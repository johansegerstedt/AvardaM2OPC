<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Config;

/**
 * Class Config
 */
class Config extends \Magento\Payment\Gateway\Config\Config
{
    const KEY_ACTIVE = 'active';
    const KEY_TEST_MODE = 'test_mode';
    const KEY_SITE_CODE = 'site_code';
    const KEY_SITE_PASSWORD = 'site_password';

    const APPLICATION_URL_STAGE = 'https://stage.avarda.org/CheckOut2';
    const APPLICATION_URL_ONLINE = 'https://online.avarda.org/CheckOut2';

    /**
     * Get Payment configuration status
     *
     * @return bool
     */
    public function isActive()
    {
        return (bool) $this->getValue(self::KEY_ACTIVE);
    }

    /**
     * @return bool
     */
    public function getTestMode()
    {
        return (bool) $this->getValue(self::KEY_TEST_MODE);
    }

    /**
     * @return string
     */
    public function getSiteCode()
    {
        return $this->getValue(self::KEY_SITE_CODE);
    }

    /**
     * @return string
     */
    public function getSitePassword()
    {
        return $this->getValue(self::KEY_SITE_PASSWORD);
    }

    /**
     * @return string
     */
    public function getApplicationUrl()
    {
        if ($this->getTestMode()) {
            return self::APPLICATION_URL_STAGE;
        }

        return self::APPLICATION_URL_ONLINE;
    }
}