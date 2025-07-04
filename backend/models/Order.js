'use strict';

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    table_number: DataTypes.STRING,
    total_amount: DataTypes.DECIMAL(10, 2),
    status: DataTypes.ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled'),
    payment_status: DataTypes.ENUM('unpaid', 'paid'),
    order_time: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'orders',
    timestamps: false
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      onDelete: 'CASCADE',
    });
  };

  return Order;
};
