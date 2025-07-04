'use strict';

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    order_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price_at_order: DataTypes.DECIMAL(10, 2),
    notes: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'order_items',
    timestamps: false
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
    });

    OrderItem.belongsTo(models.Menu, {
      foreignKey: 'menu_id',
    });
  };

  return OrderItem;
};
