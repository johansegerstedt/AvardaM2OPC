<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Http\Converter;

use Magento\Payment\Gateway\Http\ConverterException;
use Magento\Payment\Gateway\Http\ConverterInterface;

/**
 * Class JsonConverter
 * @api
 * @since 100.0.2
 */
class JsonConverter implements ConverterInterface
{
    /**
     * Converts gateway response to array structure
     *
     * @param string $response
     * @return array
     * @throws ConverterException
     */
    public function convert($response)
    {
        try {
            $convertedResponse = json_decode($response);
            if (!is_array($convertedResponse)) {
                return ['response' => $convertedResponse];
            }

            return $convertedResponse;
        } catch(\Exception $e) {
            throw new ConverterException(__('Wrong gateway response format.'));
        }
    }
}
