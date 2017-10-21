<?php

namespace Digia\AvardaCheckout\Setup;

use \Magento\Framework\Setup\InstallSchemaInterface;
use \Magento\Framework\Setup\ModuleContextInterface;
use \Magento\Framework\Setup\SchemaSetupInterface;

/**
 * Class InstallSchema
 *
 * @package Digia\AvardaCheckout\Setup
 */
class InstallSchema implements InstallSchemaInterface {
  /**
   * @param  SchemaSetupInterface $setup
   * @param  ModuleContextInterface $context
   */
  public function install(SchemaSetupInterface $setup, ModuleContextInterface $context) {
    $setup->startSetup();
    $setup->endSetup();
  }

}
