<?php
/**
 * @author    Digia Commerce Oy
 * @copyright Copyright © 2018 Digia. All rights reserved.
 * @package   Digia_AvardaCheckout
 */
namespace Digia\AvardaCheckout\Setup;

use Magento\Customer\Setup\CustomerSetupFactory;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\UpgradeDataInterface;

class UpgradeData implements UpgradeDataInterface
{
    /**
     * @var CustomerSetupFactory
     */
    protected $customerSetupFactory;

    /**
     * UpgradeData constructor.
     *
     * @param CustomerSetupFactory $customerSetupFactory
     */
    public function __construct(CustomerSetupFactory $customerSetupFactory)
    {
        $this->customerSetupFactory = $customerSetupFactory;
    }

    /**
     * {@inheritdoc}
     */
    public function upgrade(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        if (version_compare($context->getVersion(), '0.4.0', '<')) {
            $customerSetup = $this->customerSetupFactory->create(['setup' => $setup]);
            $customerSetup->addAttribute(
                \Magento\Customer\Model\Customer::ENTITY,
                'avarda_customer_token',
                [
                    'type'            => 'varchar',
                    'label'           => 'Avarda Customer Token',
                    'input'           => 'text',
                    'required'        => false,
                    'sort_order'      => 140,
                    'global'          => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_WEBSITE,
                    'group'           => 'General Information',
                    'is_user_defined' => true,
                ]
            );
        }

        $setup->endSetup();
    }
}
