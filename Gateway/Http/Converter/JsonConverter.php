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
     * @param \Zend_Http_Response $response
     * @return array
     * @throws ConverterException
     */
    public function convert($response)
    {
        try {
            if ($response->isError()) {
                return $this->getErrors($response);
            }

            $convertedResponse = json_decode($response->getBody());
            if (!is_array($convertedResponse)) {
                return [$convertedResponse];
            }

            return $convertedResponse;
        } catch(\Exception $e) {
            throw new ConverterException(__('Wrong gateway response format.'));
        }
    }

    /**
     * There are multiple types of errors, this function makes them into a general
     * format that can be used in validator.
     *
     * @param \Zend_Http_Response $response
     * @return array
     */
    public function getErrors($response)
    {
        $errors['ErrorType'] = 'Avarda Payment';
        if ($response->getStatus() == 401) {
            $errors = [
                'ErrorCode' => 401,
                'Errors' => [
                    'Invalid credentials used.'
                ]
            ];

            return $errors;
        }

        $errors['ErrorCode'] = 500;
        $body = json_decode($response->getBody());
        if (isset($body->CheckOutErrorCode)) {
            $errors['ErrorCode'] = $body->CheckOutErrorCode;
            foreach ($body->Errors as $error) {
                $errors['Errors'][] = $error;
            }
        } elseif (is_array($body)) {
            foreach ($body as $error) {
                $errors['Errors'][$error->ErrorCode] = $error->ErrorMessage;
            }
        } elseif (isset($body->Message)) {
            $errors['Errors'][] = $body->Message;
        } else {
            $errors['Errors'][] = 'An unknown error occured.';
        }

        return $errors;
    }
}
