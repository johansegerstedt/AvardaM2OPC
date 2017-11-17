<?php
/**
 * @author      Digia Commerce Oy
 * @copyright   Copyright © 2017 Digia. All rights reserved.
 * @package     Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Gateway\Validator;

use Magento\Payment\Gateway\Command\CommandException;
use Magento\Payment\Gateway\Validator\AbstractValidator;
use Magento\Payment\Gateway\Validator\ResultInterface;
use Magento\Payment\Gateway\Validator\ResultInterfaceFactory;
use Magento\Payment\Model\Method\Logger;

/**
 * Class ErrorValidator
 * @api
 * @since 100.0.2
 */
class ErrorValidator extends AbstractValidator
{
    /**
     * @var Logger
     */
    protected $logger;

    /**
     * @param ResultInterfaceFactory $resultFactory
     * @param Logger $logger
     */
    public function __construct(
        ResultInterfaceFactory $resultFactory,
        Logger $logger
    ) {
        parent::__construct($resultFactory);
        $this->logger = $logger;
    }

    /**
     * @param array $validationSubject
     * @return ResultInterface
     */
    public function validate(array $validationSubject)
    {
        $response = $validationSubject['response'];
        return $this->createResult(
            !array_key_exists('ErrorCode', $response)
        );
    }
}
