<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api;

/**
 * Interface for managing Avarda item information
 * @api
 */
interface ItemManagementInterface
{
    /**
     * Get quote items additional information not provided by Magento Webapi
     *
     * @return \Digia\AvardaCheckout\Api\Data\ItemDetailsListInterface
     */
    public function getItemDetailsList();
}
