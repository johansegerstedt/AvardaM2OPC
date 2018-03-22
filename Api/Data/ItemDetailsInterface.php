<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Api\Data;

/**
 * Interface ItemDetailsInterface
 * @api
 */
interface ItemDetailsInterface
{
    /**
     * Constants defined for keys of array, makes typos less likely
     */
    const ITEM_ID = 'item_id';
    const PRODUCT_URL = 'product_url';
    const IMAGE_URL = 'image_url';

    /**
     * Get item ID
     *
     * @return int
     */
    public function getItemId();

    /**
     * Set item ID
     *
     * @param int $itemId
     * @return $this
     */
    public function setItemId($itemId);

    /**
     * Get product URL
     *
     * @return string
     */
    public function getProductUrl();

    /**
     * Set product URL
     *
     * @param string $productUrl
     * @return $this
     */
    public function setProductUrl($productUrl);

    /**
     * Get product image URL
     *
     * @return string
     */
    public function getImageUrl();

    /**
     * Set product image URL
     *
     * @param string $imageUrl
     * @return $this
     */
    public function setImageUrl($imageUrl);
}
