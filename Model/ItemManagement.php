<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Model;

use Digia\AvardaCheckout\Api\Data\ItemDetailsInterface;
use Digia\AvardaCheckout\Api\Data\ItemDetailsInterfaceFactory;
use Digia\AvardaCheckout\Api\Data\ItemDetailsListInterface;
use Digia\AvardaCheckout\Api\Data\ItemDetailsListInterfaceFactory;
use Digia\AvardaCheckout\Api\ItemManagementInterface;
use Digia\AvardaCheckout\Api\ItemStorageInterface;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class ItemManagement implements ItemManagementInterface
{
    const IMAGE_THUMBNAIL = 'cart_page_product_thumbnail';

    /**
     * @var ItemStorageInterface
     */
    protected $itemStorage;

    /**
     * @var ItemDetailsInterfaceFactory
     */
    protected $itemDetailsFactory;

    /**
     * @var ItemDetailsListInterfaceFactory
     */
    protected $itemDetailsListFactory;

    /**
     * @var \Magento\Catalog\Helper\ImageFactory
     */
    protected $imageHelperFactory;

    /**
     * ItemManagement constructor.
     *
     * @param ItemStorageInterface $itemStorage
     * @param ItemDetailsInterfaceFactory $itemDetailsFactory
     * @param ItemDetailsListInterfaceFactory $itemDetailsListFactory
     * @param \Magento\Catalog\Helper\ImageFactory $imageHelperFactory
     */
    public function __construct(
        ItemStorageInterface $itemStorage,
        ItemDetailsInterfaceFactory $itemDetailsFactory,
        ItemDetailsListInterfaceFactory $itemDetailsListFactory,
        \Magento\Catalog\Helper\ImageFactory $imageHelperFactory
    ) {
        $this->itemStorage = $itemStorage;
        $this->itemDetailsFactory = $itemDetailsFactory;
        $this->itemDetailsListFactory = $itemDetailsListFactory;
        $this->imageHelperFactory = $imageHelperFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function getItemDetailsList()
    {
        /**
         * @var ItemDetailsListInterface $itemDetailsList
         */
        $itemDetailsList = $this->itemDetailsListFactory->create();
        $items = [];
        foreach ($this->itemStorage->getItems() as $item) {
            /**
             * @var ItemDetailsInterface $itemDetails
             */
            $itemDetails = $this->itemDetailsFactory->create();
            $itemDetails->setItemId($item->getItemId());
            $itemDetails->setProductUrl($this->getProductUrl($item));

            /**
             * Set image thumbnail url
             *
             * TODO: Make image size details load dynamically from view.xml
             */
            $imageUrl = $this->getImageUrl($item, self::IMAGE_THUMBNAIL, [
                'type' => 'small_image',
                'width' => 165,
                'height' => 165
            ]);
            $itemDetails->setImageUrl($imageUrl);

            $items[] = $itemDetails;
        }

        $itemDetailsList->setItems($items);
        return $itemDetailsList;
    }

    /**
     * Retrieve URL to item Product
     *
     * @param \Magento\Quote\Api\Data\CartItemInterface $item
     * @return string
     */
    protected function getProductUrl($item)
    {
        if ($item->getRedirectUrl()) {
            return $item->getRedirectUrl();
        }

        $product = $item->getProduct();
        $option = $item->getOptionByCode('product_type');
        if ($option) {
            $product = $option->getProduct();
        }

        return $product->getUrlModel()->getUrl($product);
    }

    /**
     * Retrieve product image
     *
     * @param \Magento\Quote\Api\Data\CartItemInterface $item
     * @param string $imageId
     * @param array $attributes
     *
     * @return string
     */
    public function getImageUrl($item, $imageId, array $attributes = [])
    {
        $product = $item->getProduct();
        $helper = $this->imageHelperFactory->create()
            ->init($product, $imageId, $attributes);

        return $helper->getUrl();
    }
}
