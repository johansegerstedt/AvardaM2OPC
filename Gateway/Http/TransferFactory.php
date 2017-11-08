<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Http;

use Magento\Payment\Gateway\Http\TransferFactoryInterface;

class TransferFactory implements TransferFactoryInterface
{
    /**
     * @var \Magento\Payment\Gateway\Http\TransferBuilder
     */
    protected $transferBuilder;

    /**
     * @var \Digia\AvardaCheckout\Gateway\Config\Config
     */
    protected $config;

    /**
     * @var string
     */
    protected $method;

    /**
     * @var string
     */
    protected $uri;

    /**
     * TransferFactory constructor.
     *
     * @param \Magento\Payment\Gateway\Http\TransferBuilder $transferBuilder
     * @param \Digia\AvardaCheckout\Gateway\Config\Config $config
     * @param string $method
     * @param string $uri
     */
    public function __construct(
        \Magento\Payment\Gateway\Http\TransferBuilder $transferBuilder,
        \Digia\AvardaCheckout\Gateway\Config\Config $config,
        $method = \Zend_Http_Client::POST,
        $uri = ''
    ) {
        $this->transferBuilder = $transferBuilder;
        $this->config = $config;
        $this->method = $method;
        $this->uri = $uri;
    }

    /**
     * Builds gateway transfer object
     *
     * @param array $request
     * @return \Magento\Payment\Gateway\Http\TransferInterface
     */
    public function create(array $request)
    {
        $headers = [
            'Content-Type' => 'application/json',
            'Authorization' => $this->getAuthorization(),
        ];

        return $this->transferBuilder
            ->setMethod($this->method)
            ->setUri($this->getUri())
            ->setHeaders($headers)
            ->setBody($request)
            ->build();
    }

    /**
     * Generate basic authorization string
     *
     * @return string
     */
    protected function getBasicAuthorization()
    {
        $authString = implode(':', [
            $this->config->getSiteCode(),
            $this->config->getSitePassword(),
        ]);

        return 'Basic ' . base64_encode($authString);
    }

    /**
     * Get URI for the request to call
     *
     * @return string
     */
    public function getUri()
    {
        return $this->config->getApplicationUrl() . $this->uri;
    }
}
